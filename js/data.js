/*
  ============================================================================
  SITE CONTENT — edit this file to add/remove/change what shows up on the
  page. You should not need to touch index.html, styles.css, or site.js
  to update your projects or papers.
  ============================================================================

  PROJECTS
  --------
  Each entry is an object with these fields:

    title       (string, required)  Project name.
    description (string, required)  1-3 sentences on what it is/does.
    tags        (string[], optional) Short tech/topic labels, e.g. ["Python", "ML"].
    image       (string, optional)  Path to a screenshot/thumbnail, e.g.
                                     "assets/projects/my-project.png".
                                     Omit it to show a plain gradient card instead.
    links       (object, optional)  Any of: { github, demo, writeup }.
                                     Each is a URL string. Omit keys you don't have.
    code        (array, optional)   Snippets shown in the "View Code" popup.
                                     Each item: { filename, language, snippet }.
                                     "language" is just a label shown in the tab
                                     (e.g. "python", "js") — purely cosmetic.

  Delete the sample project below and add your own, or just edit it in place.
*/

const PROJECTS = [
  {
    title: "Sample Project: Traffic Sign Classifier",
    description:
      "A CNN trained on the GTSRB dataset to classify traffic signs in real time from a webcam feed. Built for a computer vision course project.",
    tags: ["Python", "PyTorch", "Computer Vision"],
    image: "", // e.g. "assets/projects/traffic-signs.png"
    links: {
      github: "https://github.com/your-username/traffic-sign-classifier",
      demo: "",
      writeup: "",
    },
    code: [
      {
        filename: "train.py",
        language: "python",
        snippet:
`import torch
from torch import nn, optim
from model import TrafficSignNet
from data import get_dataloaders

def train(epochs=20, lr=1e-3):
    train_loader, val_loader = get_dataloaders(batch_size=64)
    model = TrafficSignNet(num_classes=43).to(DEVICE)
    opt = optim.Adam(model.parameters(), lr=lr)
    criterion = nn.CrossEntropyLoss()

    for epoch in range(epochs):
        model.train()
        for images, labels in train_loader:
            images, labels = images.to(DEVICE), labels.to(DEVICE)
            opt.zero_grad()
            loss = criterion(model(images), labels)
            loss.backward()
            opt.step()
        print(f"epoch {epoch}: loss={loss.item():.4f}")`,
      },
      {
        filename: "model.py",
        language: "python",
        snippet:
`import torch.nn as nn

class TrafficSignNet(nn.Module):
    def __init__(self, num_classes=43):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 32, 3, padding=1), nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(32, 64, 3, padding=1), nn.ReLU(),
            nn.MaxPool2d(2),
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(64 * 8 * 8, 128), nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(128, num_classes),
        )

    def forward(self, x):
        return self.classifier(self.features(x))`,
      },
    ],
  },
];

/*
  RESEARCH PAPERS
  ----------------
  Each entry is an object with these fields:

    title       (string, required)  Paper title.
    course      (string, optional)  Class/course it was written for.
    date        (string, optional)  e.g. "Fall 2025" or "Dec 2025".
    abstract    (string, required)  Short summary (1-4 sentences).
    tags        (string[], optional) Topic labels.
    pdf         (string, optional)  Path/URL to the PDF, e.g.
                                     "assets/papers/my-paper.pdf".
    links       (object, optional)  Any of: { pdf, slides, code }.

  Delete the sample paper below and add your own, or just edit it in place.
*/

const PAPERS = [
  {
    title: "Sample Paper: Robustness of Vision Transformers Under Adversarial Noise",
    course: "Advanced Machine Learning",
    date: "Fall 2025",
    abstract:
      "We evaluate the robustness of Vision Transformers versus CNNs under FGSM and PGD adversarial attacks, finding that ViTs degrade more gracefully at low perturbation budgets but lose this advantage as budget increases.",
    tags: ["Deep Learning", "Adversarial ML"],
    links: {
      pdf: "", // e.g. "assets/papers/vit-robustness.pdf"
      slides: "",
      code: "",
    },
  },
];
