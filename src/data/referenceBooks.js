// Experimind AI Learning Lab — CBSE Artificial Intelligence Official Reference Books & Student Handbooks
// Aligned with CBSE CT & AI (2026-27), AI4K12, and official CBSE Academic Handbooks.

window.EXPERIMIND_REFERENCE_BOOKS = [
  {
    id: "cbse-ai-class6",
    title: "CBSE Class 6 Artificial Intelligence Student Handbook",
    grade: "Class 6",
    code: "CBSE Skill Education • CTAI_Pri6SH",
    icon: "📘",
    color: "#2563eb",
    officialPdfUrl: "https://cbseacademic.nic.in/web_material/CurriculumMain27/CTAI_Pri6SH_2026-27.pdf",
    description: "The foundational reference guide for Class 6 students exploring natural vs artificial intelligence, the 5 stages of the AI Project Cycle, smart cities, and ethical computer vision.",
    units: [
      {
        unitNumber: "Unit 1",
        title: "Introduction to Artificial Intelligence & Smart World",
        competencies: "Distinguish between natural intelligence, rule-based machines, and self-learning AI systems.",
        summary: "Explores how humans learn through sensory experience and how computers use mathematical algorithms and sensors (cameras, microphones, infrared) to mimic perception and decision making.",
        keyConcepts: ["Natural vs Artificial Intelligence", "Sensors vs Human Senses", "Autonomous Agents vs Remote Controlled Devices"],
        matchingLessonId: "C6-01"
      },
      {
        unitNumber: "Unit 2",
        title: "The AI Project Cycle (5 Core Stages)",
        competencies: "Master Problem Scoping, Data Acquisition, Data Exploration, Modeling, and Evaluation.",
        summary: "A systematic 5-step engineering framework: 1. Scoping (identifying a real community need) ➔ 2. Data Acquisition (collecting labeled examples) ➔ 3. Exploration (cleansing noise and visual patterns) ➔ 4. Modeling (training algorithms) ➔ 5. Evaluation (testing with unseen data).",
        keyConcepts: ["Problem Scoping", "Data Hygiene & Cleaning", "Feature Extraction", "Test-Train Split"],
        matchingLessonId: "C6-02"
      },
      {
        unitNumber: "Unit 3",
        title: "Smart Cities & Connected IoT Living",
        competencies: "Understand sensor-to-actuator networks, telemetry, and automated environmental controls.",
        summary: "How smart traffic lights adjust timings using traffic cameras, automated agriculture valves irrigate based on soil moisture sensors, and flood early-warning sirens detect rising river levels.",
        keyConcepts: ["IoT Edge Nodes", "Sensory Telemetry", "Threshold Logic", "Early Warning Alarms"],
        matchingLessonId: "C6-03"
      },
      {
        unitNumber: "Unit 4",
        title: "Introduction to Computer Vision & Pixel Grids",
        competencies: "Understand digital pixel representations, RGB color channels, and edge detection.",
        summary: "Digital images are two-dimensional matrices of numbers from 0 (black) to 255 (white). Computers apply 3x3 convolution kernels to detect edges, shapes, and contours without human intervention.",
        keyConcepts: ["Pixel Coordinates (X, Y)", "Grayscale & RGB Depth", "Convolution Kernels", "Edge Features"],
        matchingLessonId: "C6-04"
      }
    ]
  },
  {
    id: "cbse-ai-class7",
    title: "CBSE Class 7 Artificial Intelligence Student Handbook",
    grade: "Class 7",
    code: "CBSE Skill Education • CTAI_Pri7SH",
    icon: "📗",
    color: "#059669",
    officialPdfUrl: "https://cbseacademic.nic.in/web_material/CurriculumMain27/CTAI_Pri7SH_2026-27.pdf",
    description: "Intermediate AI guide covering algorithmic bias, dataset diversity, computer vision convolutions, Natural Language Processing tokenization, and mathematics for AI.",
    units: [
      {
        unitNumber: "Unit 1",
        title: "AI Ethics, Algorithmic Bias & Fair Datasets",
        competencies: "Identify bias in historical training data and design inclusive datasets.",
        summary: "Machine learning models mirror whatever biases exist in their training data. Class imbalance, unrepresentative lighting, or skewed gender/demographic samples lead to unfair decisions.",
        keyConcepts: ["Historical & Algorithmic Bias", "Class Imbalance", "Dataset Representation", "Responsible AI Governance"],
        matchingLessonId: "C7-01"
      },
      {
        unitNumber: "Unit 2",
        title: "Computer Vision: Kernels, Sobel Edge Filters & Shapes",
        competencies: "Apply 3x3 convolution matrices to image matrices and compute geometric circularity.",
        summary: "Convolutional layers slide mathematical filters across pixels to create feature maps. Sobel vertical filters highlight columns, horizontal filters detect rows, and contour tracing finds object boundaries.",
        keyConcepts: ["Sobel Edge Detector", "Feature Maps", "Contour Perimeter & Area", "Circularity Ratios"],
        matchingLessonId: "C7-03"
      },
      {
        unitNumber: "Unit 3",
        title: "Natural Language Processing (NLP) & Sentiment Analysis",
        competencies: "Tokenize text, filter grammatical stop words, and classify emotional polarity.",
        summary: "How search engines and chatbots process human language: tokenizing sentences into individual words, removing common stop words ('the', 'is', 'at'), extracting keyword stems, and calculating sentiment scores.",
        keyConcepts: ["Sentence Tokenization", "Stop Word Removal", "TF-IDF Keywords", "Sentiment Polarity"],
        matchingLessonId: "C7-05"
      },
      {
        unitNumber: "Unit 4",
        title: "Mathematics & Statistics for Machine Learning",
        competencies: "Understand Cartesian coordinates, Euclidean distance, and probability weights.",
        summary: "Computer vision and ML classifiers rely on simple mathematics: calculating Euclidean distance between color vectors ΔE = √((R-Rt)² + (G-Gt)² + (B-Bt)²) to recognize objects in camera frames.",
        keyConcepts: ["Euclidean Distance", "Probability Distributions", "Feature Vectors", "Centroids"],
        matchingLessonId: "C7-06"
      }
    ]
  },
  {
    id: "cbse-ai-class8",
    title: "CBSE Class 8 Artificial Intelligence Student Handbook",
    grade: "Class 8",
    code: "CBSE Skill Education • CTAI_Pri8SH",
    icon: "📕",
    color: "#dc2626",
    officialPdfUrl: "https://cbseacademic.nic.in/web_material/CurriculumMain27/CTAI_Pri8SH_2026-27.pdf",
    description: "Advanced middle school AI curriculum: supervised vs unsupervised machine learning, artificial neural network perceptrons, model evaluation metrics, and generative AI safety.",
    units: [
      {
        unitNumber: "Unit 1",
        title: "Supervised, Unsupervised & Reinforcement Learning",
        competencies: "Compare classification, regression, clustering, and policy reward feedback.",
        summary: "Supervised learning trains on labeled inputs (e.g. labeled dog and cat photos); Unsupervised learning discovers hidden patterns in unlabeled data via clustering; Reinforcement learning trains agents using rewards and penalties.",
        keyConcepts: ["Labeled Training Data", "K-Means Clustering", "Agent Reward Functions", "Decision Boundaries"],
        matchingLessonId: "C8-01"
      },
      {
        unitNumber: "Unit 2",
        title: "Artificial Neural Networks & The Biological Perceptron",
        competencies: "Calculate neuron weighted sums z = Σ(w_i * x_i) + b and activation functions.",
        summary: "Modeled after biological brain neurons: inputs (dendrites) are multiplied by synaptic weights (synapses), summed with a threshold bias in the cell body (soma), and passed through an activation function (sigmoid, step, ReLU) to fire down the axon.",
        keyConcepts: ["Weights & Biases", "Neuron Soma & Axon", "Sigmoid & ReLU Activation", "Forward Propagation"],
        matchingLessonId: "C8-03"
      },
      {
        unitNumber: "Unit 3",
        title: "Evaluating AI Models: Confusion Matrix, Precision & Recall",
        competencies: "Compute True Positives, False Positives, Precision, Recall, and F1-Scores.",
        summary: "Accuracy alone can be misleading when datasets are imbalanced. A confusion matrix breaks results into True Positives (TP), False Positives (FP), False Negatives (FN), and True Negatives (TN) to evaluate reliability.",
        keyConcepts: ["Confusion Matrix", "Type 1 vs Type 2 Errors", "Precision vs Recall Tradeoff", "F1-Score Harmonization"],
        matchingLessonId: "C8-05"
      },
      {
        unitNumber: "Unit 4",
        title: "Generative AI, Large Language Models & Responsible Governance",
        competencies: "Understand next-token prediction, prompt engineering, deepfake risks, and 4Ws ethical scoping.",
        summary: "Generative models produce new text, images, and code through probability distributions. Responsible AI requires human-in-the-loop governance, deepfake watermarking, privacy protection, and transparent source citations.",
        keyConcepts: ["Prompt Engineering & Persona", "Next-Token Probability", "Deepfake Watermarking", "Human-in-the-Loop Governance"],
        matchingLessonId: "C8-08"
      }
    ]
  },
  {
    id: "cbse-ctai-framework",
    title: "CBSE CT & AI Master Curriculum Framework (Classes 3–8)",
    grade: "Classes 3–8",
    code: "Official CBSE Framework • 2026-27",
    icon: "📙",
    color: "#d97706",
    officialPdfUrl: "https://cbseacademic.nic.in/web_material/CurriculumMain27/CTAI_Pri_2026-27.pdf",
    description: "The overarching educational policy and progression matrix defining Computational Thinking (CT) and Artificial Intelligence (AI) across primary and middle school grades.",
    units: [
      {
        unitNumber: "Domain 1",
        title: "Decomposition & Pattern Recognition",
        competencies: "Break down complex real-world challenges into smaller, manageable sub-problems.",
        summary: "Students learn to recognize repeating motifs, similarities, and modular patterns across robotics, everyday schedules, games, and nature.",
        keyConcepts: ["Sub-Problem Scoping", "Pattern Identification", "Modularity", "Abstraction"],
        matchingLessonId: "C3-01"
      },
      {
        unitNumber: "Domain 2",
        title: "Algorithmic Thinking & Flowchart Logic",
        competencies: "Express clear step-by-step instructions with sequence, conditionals, and loops.",
        summary: "Visualizing procedural logic through directional arrow grids, standard flowchart shapes (terminators, decisions, operations), and block-based Scratch code.",
        keyConcepts: ["Sequential Execution", "Conditionals (If-Then-Else)", "Finite Loops", "Debugging"],
        matchingLessonId: "C4-01"
      },
      {
        unitNumber: "Domain 3",
        title: "Data Representation & Visual Analytics",
        competencies: "Collect, sanitize, and interpret numerical and categorical datasets.",
        summary: "Progressing from tactile sorting to frequency tally charts, bar graphs, Cartesian scatter plots, and multi-dimensional matrices.",
        keyConcepts: ["Categorical vs Numerical Data", "Data Cleaning", "Bar Charts & Scatter Plots", "Trends"],
        matchingLessonId: "C5-01"
      },
      {
        unitNumber: "Domain 4",
        title: "AI4K12 Five Big Ideas of Artificial Intelligence",
        competencies: "Apply Perception, Representation & Reasoning, Learning, Natural Interaction, and Societal Impact.",
        summary: "The globally recognized AI education framework: 1. Perception (computers perceive the world using sensors) ➔ 2. Representation & Reasoning ➔ 3. Learning (computers learn from data) ➔ 4. Natural Interaction ➔ 5. Societal Impact.",
        keyConcepts: ["The 5 Big Ideas", "Ethical Technology Use", "Child Safety & Privacy", "Inclusive Design"],
        matchingLessonId: "C6-01"
      }
    ]
  },
  {
    id: "cbse-facilitator-handbook",
    title: "CBSE AI Teacher & Facilitator Lab Handbook",
    grade: "Teachers / Computer Lab Instructors",
    code: "CBSE Middle School Facilitator Guide",
    icon: "📓",
    color: "#7c3aed",
    officialPdfUrl: "https://cbseacademic.nic.in/web_material/Curriculum26/publication/middle/AI_Facilitators_Handbook_VIII.pdf",
    description: "Pedagogical implementation manual for computer lab teachers, containing lesson plans, assessment rubrics, and unplugged classroom alternatives.",
    units: [
      {
        unitNumber: "Section 1",
        title: "Experiential Learning & Child-First Computer Lab Setup",
        competencies: "Establish zero-distraction offline lab workflows with equal hardware access.",
        summary: "Guidelines for pairing students at lab terminals, zero-admin Windows deployment, managing webcam privacy without internet streaming, and encouraging collaborative peer exploration.",
        keyConcepts: ["Pair Programming", "Zero-PII Compliance", "Offline Lab Workflows", "Equal Participation"],
        matchingLessonId: "C6-02"
      },
      {
        unitNumber: "Section 2",
        title: "Unplugged Classroom Demonstrations & Activity Cards",
        competencies: "Facilitate kinesthetic AI concepts without requiring computer screens.",
        summary: "Physical classroom roleplay games: Human Robot stage choreographing paper Scratch blocks, Card Sorting Classifiers for decision trees, and Flashcard Training sets for machine learning bias.",
        keyConcepts: ["Kinesthetic Learning", "Card Sorting Games", "Roleplay Scenarios", "Tangible Models"],
        matchingLessonId: "C7-01"
      },
      {
        unitNumber: "Section 3",
        title: "Assessment Rubrics & Continuous Comprehensive Evaluation",
        competencies: "Evaluate computational thinking portfolios, simulator problem-solving, and quizzes.",
        summary: "Formative evaluation rubrics focusing on algorithmic logic, debugging resilience, feature observation, and thoughtful ethical discussion rather than rote memorization.",
        keyConcepts: ["Formative Assessment", "Debugging Rubrics", "Portfolio Stars", "Self-Reflection"],
        matchingLessonId: "C8-05"
      }
    ]
  }
];

