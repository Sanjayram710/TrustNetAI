import os
import io
from pathlib import Path
import torch
import torch.nn as nn
import numpy as np
from PIL import Image
import torchvision.transforms as T

# ── Fallback Trained Architecture (CIFAKE benchmarked detector) ──
class LightweightCNN(nn.Module):
    def __init__(self, in_channels=3, num_classes=2, dropout_rate=0.3):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(in_channels, 32, kernel_size=3, stride=1, padding=1, bias=False),
            nn.BatchNorm2d(32),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2, stride=2),

            nn.Conv2d(32, 64, kernel_size=3, stride=1, padding=1, bias=False),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2, stride=2),

            nn.Conv2d(64, 128, kernel_size=3, stride=1, padding=1, bias=False),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2, stride=2),

            nn.Conv2d(128, 256, kernel_size=3, stride=1, padding=1, bias=False),
            nn.BatchNorm2d(256),
            nn.ReLU(inplace=True),
            nn.AdaptiveAvgPool2d((1, 1))
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Dropout(p=dropout_rate),
            nn.Linear(256, 128),
            nn.ReLU(inplace=True),
            nn.Dropout(p=dropout_rate * 0.7),
            nn.Linear(128, num_classes)
        )

    def forward(self, x):
        feat = self.features(x)
        return self.classifier(feat)


class ImageDeepfakeDetector:
    def __init__(self, weights_path="models/best_coatnet_5ch.pth"):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.mode = "unknown"

        # Check if 5-channel CoAtNet weights exist
        coatnet_exists = os.path.exists(weights_path)
        
        if coatnet_exists:
            try:
                import timm
                import cv2
                self.model = self._build_coatnet_5ch()
                state_dict = torch.load(weights_path, map_location=self.device)
                self.model.load_state_dict(state_dict)
                self.model.to(self.device)
                self.model.eval()
                self._hook_features = {}
                self._hook_handle = self.model.head.global_pool.register_forward_hook(self._capture_hook)
                self.mode = "coatnet"
            except Exception as e:
                coatnet_exists = False

        if not coatnet_exists:
            # Load the pre-trained TrustNet CNN detector (REAL vs AI_GENERATED)
            possible_paths = [
                Path(__file__).resolve().parent.parent / "models" / "best_image_detector.pt",
                Path("models/best_image_detector.pt"),
                Path("FinalFrameWork/models/best_image_detector.pt"),
                Path("C:/TrustNetAI/training/image_detector/models/best_image_detector.pt")
            ]
            checkpoint_file = None
            for p in possible_paths:
                if p.exists():
                    checkpoint_file = p
                    break

            if checkpoint_file is not None:
                ckpt = torch.load(checkpoint_file, map_location=self.device)
                class_to_idx = ckpt.get("class_to_idx", {"REAL": 0, "AI_GENERATED": 1})
                self.idx_to_class = {v: k for k, v in class_to_idx.items()}
                self.model = LightweightCNN(in_channels=3, num_classes=len(class_to_idx), dropout_rate=0.3)
                self.model.load_state_dict(ckpt["model_state_dict"])
                self.model.to(self.device)
                self.model.eval()
                self.transform = T.Compose([
                    T.Resize((224, 224)),
                    T.ToTensor(),
                    T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
                ])
                self.mode = "trained_cnn"
            else:
                self.mode = "uninitialized"

    def _build_coatnet_5ch(self, num_classes=1):
        import timm
        model = timm.create_model('coatnet_0_rw_224', pretrained=False, num_classes=num_classes)
        original_conv = model.stem.conv1
        new_conv = nn.Conv2d(
            in_channels=5, 
            out_channels=original_conv.out_channels,
            kernel_size=original_conv.kernel_size, 
            stride=original_conv.stride,
            padding=original_conv.padding, 
            bias=original_conv.bias is not None
        )
        model.stem.conv1 = new_conv
        return model

    def _capture_hook(self, module, input, output):
        self._hook_features['embedding'] = output.detach()

    def predict(self, image_bytes):
        if self.mode == "coatnet":
            import cv2
            nparr = np.frombuffer(image_bytes, np.uint8)
            image_bgr = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
            image_tensor = self._prepare_5ch_tensor(image_rgb).unsqueeze(0).to(self.device)

            with torch.no_grad():
                outputs = self.model(image_tensor)
                prob = torch.sigmoid(outputs).item()

            if prob > 0.5:
                return "Fake (AI Generated)", prob
            else:
                return "Real Image", 1 - prob

        elif self.mode == "trained_cnn":
            img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            tensor = self.transform(img).unsqueeze(0).to(self.device)
            with torch.no_grad():
                outputs = self.model(tensor)
                probs = torch.softmax(outputs, dim=1).squeeze(0)
            
            prob_real = float(probs[0].item())
            prob_ai = float(probs[1].item())

            if prob_ai > 0.5:
                return "Fake (AI Generated)", prob_ai
            else:
                return "Real Image", prob_real
        else:
            return "Error: No model checkpoint loaded", 0.0

    def extract_features(self, image_rgb: np.ndarray) -> np.ndarray:
        if self.mode == "coatnet":
            tensor = self._prepare_5ch_tensor(image_rgb).unsqueeze(0).to(self.device)
            with torch.no_grad():
                _ = self.model(tensor)
            embedding = self._hook_features['embedding'].squeeze().cpu().numpy()
            self._hook_features.clear()
            return embedding
        else:
            return np.zeros(768, dtype=np.float32)
