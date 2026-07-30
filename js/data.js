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
  {
    title: "CS128 Final Project: Image Enhancement/Compression Suite",
    description:
      "My first college project experience! Created a terminal-based suite of ppm filters and compression/decompression algorithms using Huffman compression in C++.",
    tags: ["C++", "Huffman Compression", "Image Filters"],
    image: "", // e.g. "assets/projects/traffic-signs.png"
    links: {
      github: "",
      demo: "",
      writeup: "",
    },
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
    title: "Tapestry: Snapshot Isolation and Deterministic Commits for Multi-Agent Memory",
    course: "Advanced Distributed Systems",
    date: "Spring 2026",
    abstract:
      "LLM agents are increasingly deployed as multiagent systems (MAS) that collaborate on complex tasks such as planning, code generation, and research synthesis. Empirical analysis of MAS failures confirms that 44.2% stem from system design issues rather than model limitations [2], underscoring the need for principled shared state infrastructure. A central challenge in these systems is shared memory: agents must read and write a common execution state without introducing inconsistencies, lost updates, or redundant work. Existing frameworks fail to provide concurrency control and durability guarantees for multi-agent shared state. We present Tapestry, a concurrency control and durability layer for shared agent tapes in MAS. Our design represents memory as an append-only log with typed events and an immutable checkpoint chain. Agents execute against snapshot reads and concurrently write to a staging area; a deterministic committer validates and merges writes before advancing the committed checkpoint. We evaluate Tapestry on GAIA, a multi-agent question-answering benchmark with three levels of increasing task complexity. Compared to a single-agent TapeAgents baseline, Tapestry delivers two advantages that grow with task complexity: concurrent multi-wave execution yields up to a 63% token reduction and 45% latency reduction on Level 3 GAIA tasks, and checkpoint-based crash recovery provides up to an 8.8× speedup over a full cold restart. These results demonstrate that principled concurrency control and durable state management provide a practical path to scaling multi-agent systems as task complexity increases.",
    tags: ["Distributed Systems", "Multi-Agent Systems"],
    links: {
      pdf: "assets/papers/CS525_paper.pdf", // e.g. "assets/papers/vit-robustness.pdf"
      slides: "",
      code: "",
    },
  },
  {
    title: "SecARP: Scalable ARP spoofing mitigation with a Distributed SDN",
    course: "Advanced Networking",
    date: "Fall 2025",
    abstract:
      "ARP spoofing is a perennial problem in computer security. The stateless and trusting nature of the ARP protocol allows bad actors to mimic other hosts in a network and engage in attacks like Man-in-the-Middle. As a result, solutions to this problem have also appeared. We present in this paper a distributed SDN controller solution which drastically reduces latency for packets in the network while still remaining effective at detecting and mitigating ARP spoofing attempts.",
    tags: ["Computer Networks", "Network Security", "Distributed Systems"],
    links: {
      pdf: "assets/papers/CS538_paper.pdf", // e.g. "assets/papers/vit-robustness.pdf"
      slides: "",
      code: "",
    },
  },
  {
    title: "ORIGIN: Google Street-view Image Location Discovery",
    course: "Advanced Computer Vision",
    date: "Fall 2025",
    abstract:
      "Identifying the location at which different images have been taken from have long had applications in national defense and security, but in recent years, has also become increasingly popular in video games such as GeoGuessr. This project aims to translate the popular game to computers by using computer vision techniques to localize where different street-view images originate from instead of prompting a human user.",
    tags: ["Computer Vision"],
    links: {
      pdf: "assets/papers/CS543_paper.pdf", // e.g. "assets/papers/vit-robustness.pdf"
      slides: "",
      code: "",
    },
  },
  {
    title: "WIPIVIZ: A study on how WiFi Visualization can help users identify WiFi hotspots",
    course: "Smart Cities, Homes, and Beyond",
    date: "Fall 2025",
    abstract:
      "As the dependence on stable WiFi continues to grow,weunderstand that the placement of WiFi routers and devices requiring the signal will also become more important. WiFi signals can be affected widely by walls, doors, and nearby objects. However, the effect obstacles have on WiFi signal strength is hard to visualize and quantify for most consumers.\n Our project, WIPIVIZ, aims to bridge this knowledge gap and help educate consumers about the ideal placement of routers to help them provide the most stable WiFi connection to devices in the room. Eventually, we would want our project, WIPIVIZ, to allow for a seamless way for users to use the VR headset to directly \"place\" and test virtual router locations in a room and visualize estimated WiFi hot spots, and figure out where the connection may not be as strong.",
    tags: ["Human-Computer Interaction", "Wireless Networks", "Visualization"],
    links: {
      pdf: "assets/papers/CS598EKS_paper.pdf", // e.g. "assets/papers/vit-robustness.pdf"
      slides: "",
      code: "",
    },
  },
  {
    title: "CS412 Project on Earthquake Prediction using Phonetic Data",
    course: "Data Mining",
    date: "Spring 2026",
    abstract:
      "Reliable earthquake forecasting remains an open problem in seismology. Motivated by an analogy between prosodic structure in speech and stress-related changes in acoustic waveforms, we investigate whether speech-inspired features can predict the remaining time before laboratory-induced fault failure. We compare handcrafted eGeMAPS acoustic features against data-driven MiniRocket convolutional features, evaluating both with LightGBM, XGBoost, Random Forest, and SVR regressors on Kaggle private test MAE and five-fold cross-validation MAE. LightGBM trained on eGeMAPS features achieves the best overall performance, outperforming all other model and feature combinations. Feature importance analysis shows that the top eGeMAPS feature (related to first-formant bandwidth variability) and the top MiniRocket feature are highly correlated, indicating that the two independent pipelines converge on a similar underlying predictive signal despite differing extraction philosophies. Finally, a preprocessing ablation reveals that wavelet denoising improves eGeMAPS performance but degrades MiniRocket performance, suggesting that preprocessing should be tailored to the feature extractor: handcrafted features benefit from noise suppression, whereas MiniRocket relies on fine-grained temporal textures that denoising can remove. These findings highlight the value of aligning preprocessing and feature-extraction strategies with the structural assumptions of the downstream model when analyzing pre-failure acoustic signals.",
    tags: ["Data Mining"],
    links: {
      pdf: "assets/papers/CS412_paper.pdf", // e.g. "assets/papers/vit-robustness.pdf"
      slides: "",
      code: "",
    },
  },
];
