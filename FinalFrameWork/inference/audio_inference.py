import os
import torch
import numpy as np

class AudioDeepfakeDetector:
    def __init__(self, model_name="openai/whisper-base", xgb_path="models/xgboost_asvspoof_model.joblib"):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.available = False
        self.processor = None
        self.whisper = None
        self.classifier = None

        if os.path.exists(xgb_path):
            try:
                import joblib
                from transformers import WhisperProcessor, WhisperModel
                self.processor = WhisperProcessor.from_pretrained(model_name)
                self.whisper = WhisperModel.from_pretrained(model_name).to(self.device)
                self.whisper.eval()
                self.classifier = joblib.load(xgb_path)
                self.available = True
            except Exception:
                self.available = False

    def extract_features(self, audio_path: str) -> np.ndarray:
        if not self.available:
            return np.zeros(512, dtype=np.float32)
        import librosa
        audio_array, sr = librosa.load(audio_path, sr=16000)
        inputs = self.processor(audio_array, sampling_rate=16000, return_tensors="pt")
        input_features = inputs.input_features.to(self.device)
        with torch.no_grad():
            encoder_outputs = self.whisper.encoder(input_features)
            hidden_states = encoder_outputs.last_hidden_state
            audio_embedding = hidden_states.mean(dim=1).squeeze().cpu().numpy()
        return audio_embedding

    def predict(self, audio_path):
        if not self.available:
            return "Audio weights not loaded (models/xgboost_asvspoof_model.joblib required)", 0.0
        audio_embedding = self.extract_features(audio_path)
        embedding_2d = np.expand_dims(audio_embedding, axis=0)
        probabilities = self.classifier.predict_proba(embedding_2d)[0]
        spoof_prob = float(probabilities[1])
        if spoof_prob > 0.5:
            return "Spoof (AI Generated)", spoof_prob
        else:
            return "Bonafide (Real Human)", 1 - spoof_prob
