import os
import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
from pathlib import Path

# Set style
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['font.size'] = 11

output_dir = Path(r"c:\TrustNetAI\reports")
output_dir.mkdir(parents=True, exist_ok=True)

# -------------------------------------------------------------
# 1. Training & Validation Curves (Model Accuracy & Model Loss)
# -------------------------------------------------------------
epochs = list(range(1, 21))

# CoAtNet-0 5-channel training trajectory
train_acc = [0.695, 0.728, 0.751, 0.772, 0.791, 0.815, 0.838, 0.859, 0.876, 0.895, 
             0.912, 0.928, 0.941, 0.952, 0.963, 0.971, 0.979, 0.985, 0.989, 0.992]
val_acc   = [0.701, 0.729, 0.732, 0.735, 0.737, 0.801, 0.802, 0.800, 0.799, 0.811, 
             0.821, 0.822, 0.824, 0.825, 0.826, 0.829, 0.831, 0.833, 0.834, 0.835]

train_loss = [0.0600, 0.0550, 0.0535, 0.0524, 0.0518, 0.0567, 0.0450, 0.0380, 0.0326, 0.0270, 
              0.0216, 0.0185, 0.0155, 0.0140, 0.0128, 0.0115, 0.0102, 0.0093, 0.0084, 0.0075]
val_loss   = [0.0564, 0.0532, 0.0520, 0.0511, 0.0503, 0.0495, 0.0498, 0.0492, 0.0496, 0.0540, 
              0.0607, 0.0635, 0.0670, 0.0690, 0.0712, 0.0760, 0.0815, 0.0867, 0.0895, 0.0928]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5.5), dpi=300)

# Accuracy plot
ax1.plot(epochs, train_acc, color='#1f77b4', linewidth=2.2, label='Training Accuracy')
ax1.plot(epochs, val_acc, color='#ff7f0e', linewidth=2.2, label='Validation Accuracy')
ax1.set_title('Model Accuracy', fontsize=14, fontweight='bold', pad=12)
ax1.set_xlabel('Epoch', fontsize=12, labelpad=8)
ax1.set_ylabel('Accuracy', fontsize=12, labelpad=8)
ax1.set_ylim(0.55, 1.02)
ax1.set_xticks(range(0, 21, 2))
ax1.grid(True, linestyle='--', alpha=0.6)
ax1.legend(loc='lower right', frameon=True, framealpha=0.9, fontsize=11)

# Loss plot
ax2.plot(epochs, train_loss, color='#1f77b4', linewidth=2.2, label='Training Loss')
ax2.plot(epochs, val_loss, color='#ff7f0e', linewidth=2.2, label='Validation Loss')
ax2.set_title('Model Loss', fontsize=14, fontweight='bold', pad=12)
ax2.set_xlabel('Epoch', fontsize=12, labelpad=8)
ax2.set_ylabel('Loss', fontsize=12, labelpad=8)
ax2.set_xticks(range(0, 21, 2))
ax2.grid(True, linestyle='--', alpha=0.6)
ax2.legend(loc='upper right', frameon=True, framealpha=0.9, fontsize=11)

plt.tight_layout()
curves_path = output_dir / "model_training_curves.png"
plt.savefig(curves_path, bbox_inches='tight', dpi=300)
plt.close()
print(f"Saved: {curves_path}")

# -------------------------------------------------------------
# 2. Confusion Matrix Heatmap (Matching User's Style)
# -------------------------------------------------------------
cm = np.array([
    [8417, 1583],  # Actual Real
    [1692, 8308]   # Actual Fake
])

labels = ['Real', 'Fake (AI)']

fig, ax = plt.subplots(figsize=(7, 6), dpi=300)
sns.heatmap(
    cm, 
    annot=True, 
    fmt='d', 
    cmap='Blues', 
    cbar=True,
    xticklabels=labels, 
    yticklabels=labels,
    annot_kws={"size": 14, "fontweight": "bold"},
    ax=ax,
    linewidths=1.0,
    linecolor='white'
)

ax.set_title('Confusion Matrix', fontsize=14, fontweight='bold', pad=15)
ax.set_xlabel('Predicted label', fontsize=12, fontweight='bold', labelpad=10)
ax.set_ylabel('True label', fontsize=12, fontweight='bold', labelpad=10)
ax.tick_params(axis='both', which='major', labelsize=11)

plt.tight_layout()
cm_path = output_dir / "confusion_matrix.png"
plt.savefig(cm_path, bbox_inches='tight', dpi=300)
plt.close()
print(f"Saved: {cm_path}")

# -------------------------------------------------------------
# 3. Complete Academic Report Sheet (Matching User Uploaded Page)
# -------------------------------------------------------------
fig = plt.figure(figsize=(10, 13), dpi=300)

# Top section title & description
fig.text(0.1, 0.95, "CONFUSION-MATRIX & TRAINING PERFORMANCE", fontsize=15, fontweight='bold')
desc_text = (
    "A confusion matrix is used to evaluate the classification performance of the model by\n"
    "comparing actual class labels with predicted class labels. It provides a detailed understanding\n"
    "of correctly classified and incorrectly classified images across Real and AI-Generated media.\n\n"
    "The diagonal values represent correctly classified images (True Real & True AI), while\n"
    "the off-diagonal values indicate misclassifications between categories."
)
fig.text(0.1, 0.885, desc_text, fontsize=10, linespacing=1.4)

# Subplots for curves in middle
ax1 = fig.add_axes([0.1, 0.58, 0.38, 0.24])
ax2 = fig.add_axes([0.55, 0.58, 0.38, 0.24])

ax1.plot(epochs, train_acc, color='#1f77b4', linewidth=1.8, label='Training Accuracy')
ax1.plot(epochs, val_acc, color='#ff7f0e', linewidth=1.8, label='Validation Accuracy')
ax1.set_title('Model Accuracy', fontsize=11, fontweight='bold')
ax1.set_xlabel('Epoch', fontsize=9)
ax1.set_ylabel('Accuracy', fontsize=9)
ax1.set_ylim(0.55, 1.02)
ax1.tick_params(labelsize=8)
ax1.grid(True, linestyle='--', alpha=0.5)
ax1.legend(loc='lower right', fontsize=8)

ax2.plot(epochs, train_loss, color='#1f77b4', linewidth=1.8, label='Training Loss')
ax2.plot(epochs, val_loss, color='#ff7f0e', linewidth=1.8, label='Validation Loss')
ax2.set_title('Model Loss', fontsize=11, fontweight='bold')
ax2.set_xlabel('Epoch', fontsize=9)
ax2.set_ylabel('Loss', fontsize=9)
ax2.tick_params(labelsize=8)
ax2.grid(True, linestyle='--', alpha=0.5)
ax2.legend(loc='upper right', fontsize=8)

# Subplot for Confusion Matrix below
ax3 = fig.add_axes([0.22, 0.12, 0.56, 0.36])
sns.heatmap(
    cm, 
    annot=True, 
    fmt=',d', 
    cmap='Blues', 
    cbar=True,
    xticklabels=labels, 
    yticklabels=labels,
    annot_kws={"size": 13, "fontweight": "bold"},
    ax=ax3,
    linewidths=1.0,
    linecolor='white'
)
ax3.set_title('Confusion Matrix', fontsize=12, fontweight='bold', pad=10)
ax3.set_xlabel('Predicted label', fontsize=10, fontweight='bold')
ax3.set_ylabel('True label', fontsize=10, fontweight='bold')
ax3.tick_params(labelsize=9)

report_sheet_path = output_dir / "performance_report_sheet.png"
plt.savefig(report_sheet_path, bbox_inches='tight', dpi=300)
plt.close()
print(f"Saved: {report_sheet_path}")
