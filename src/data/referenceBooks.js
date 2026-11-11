// Experimind AI Learning Lab — CBSE Artificial Intelligence Official Reference Books & Student Handbooks
// 100% Offline Digital Reading Suite. Aligned with CBSE CT & AI (2026-27), NEP 2020, and AI4K12.
// Fully readable offline without internet connection or external PDF viewers.

window.EXPERIMIND_REFERENCE_BOOKS = [
  {
    id: "cbse-ai-class6",
    title: "CBSE Class 6 Artificial Intelligence Student Handbook",
    grade: "Class 6",
    code: "CBSE Skill Education • CTAI_Pri6SH (2026-27)",
    icon: "📘",
    color: "#2563eb",
    officialPdfUrl: "https://cbseacademic.nic.in/web_material/CurriculumMain27/CTAI_Pri6SH_2026-27.pdf",
    description: "The official foundational reference guide for Class 6 students exploring natural vs artificial intelligence, the 5 stages of the AI Project Cycle, smart cities, and ethical computer vision.",
    units: [
      {
        unitNumber: "Unit 1",
        title: "Introduction to Artificial Intelligence & Smart World",
        competencies: "Distinguish between natural intelligence, rule-based machines, and self-learning AI systems.",
        summary: "Explores how humans learn through sensory experience and how computers use mathematical algorithms and sensors (cameras, microphones, infrared) to mimic perception and decision making.",
        keyConcepts: ["Natural vs Artificial Intelligence", "Sensors vs Human Senses", "Autonomous Agents vs Remote Controlled Devices"],
        matchingLessonId: "C6-01",
        chapterContent: [
          "Human intelligence is our natural ability to perceive our surroundings through our 5 senses (sight, hearing, touch, taste, smell), remember past experiences, solve unexpected problems, and adapt our behavior.",
          "Artificial Intelligence (AI) refers to computer software and hardware systems designed to perform tasks that traditionally require human intelligence—such as recognizing faces in photos, understanding spoken languages, playing chess, and navigating vehicles.",
          "A major milestone for young computer scientists is understanding the difference between a Rule-Based Automated Machine and a true Machine Learning AI. A calculator or traffic light timer follows fixed IF-THEN rules written by human programmers. If an unexpected situation occurs, it cannot learn. In contrast, an AI system learns patterns directly from data examples without being explicitly given every rule.",
          "In everyday life, AI powers weather prediction radars, voice assistants (Siri, Alexa), recommendation engines on educational platforms, and automated robotics in factories."
        ],
        reviewQuestions: [
          { q: "What is the primary difference between a microwave timer and an AI smart thermostat?", a: "A microwave timer runs a fixed countdown rule; a smart thermostat observes daily room temperature patterns and learns when to adjust heating automatically." },
          { q: "Name three physical sensors that act as 'eyes and ears' for an AI system.", a: "Camera image sensors (vision), microphone diaphragms (audio), and ultrasonic / infrared proximity sensors (distance)." }
        ]
      },
      {
        unitNumber: "Unit 2",
        title: "The AI Project Cycle (5 Core Stages)",
        competencies: "Master Problem Scoping, Data Acquisition, Data Exploration, Modeling, and Evaluation.",
        summary: "A systematic 5-step engineering framework: 1. Scoping ➔ 2. Data Acquisition ➔ 3. Exploration ➔ 4. Modeling ➔ 5. Evaluation.",
        keyConcepts: ["4Ws Canvas (Who, What, Where, Why)", "Data Hygiene & Cleansing", "Feature Extraction", "Test-Train Split"],
        matchingLessonId: "C6-02",
        chapterContent: [
          "Building an AI system is not magic; it follows a rigorous engineering process known as the AI Project Cycle, comprising five consecutive phases:",
          "1. Problem Scoping: Before touching code, engineers clearly define the real-world problem using the 4Ws Canvas (Who is affected? What is the exact issue? Where does it happen? Why does solving it help society?).",
          "2. Data Acquisition: Gathering authentic, reliable, and diverse training data (images, audio clips, sensor logs). The golden rule of AI is 'Garbage In, Garbage Out'—if the training data is low quality or biased, the AI will fail.",
          "3. Data Exploration: Cleansing noise, removing corrupted files, normalizing values, and visualizing trends using bar charts, scatter plots, and histograms.",
          "4. Modeling: Choosing and training a mathematical algorithm (such as Decision Trees, K-Nearest Neighbors, or Neural Networks) on the cleaned dataset.",
          "5. Evaluation: Testing the trained model on a separate 'Test Set' of data that the model has NEVER seen before to measure its real-world accuracy and reliability."
        ],
        reviewQuestions: [
          { q: "Why must test data always be kept separate from training data during the AI Project Cycle?", a: "If you test a student using the exact same questions with answers they memorized yesterday, you measure memorization, not true understanding. Similarly, an AI must be tested on unseen data to verify it actually learned the concept." },
          { q: "What are the 4Ws of Problem Scoping?", a: "Who (stakeholders), What (nature of the problem), Where (context & location), and Why (the positive impact of the solution)." }
        ]
      },
      {
        unitNumber: "Unit 3",
        title: "Smart Cities & Connected IoT Living",
        competencies: "Understand sensor-to-actuator networks, telemetry, and automated environmental controls.",
        summary: "How smart traffic lights adjust timings using traffic cameras, automated agriculture valves irrigate based on soil moisture sensors, and flood early-warning sirens detect rising river levels.",
        keyConcepts: ["IoT Edge Nodes", "Sensory Telemetry", "Threshold Logic", "Early Warning Alarms"],
        matchingLessonId: "C6-03",
        chapterContent: [
          "The Internet of Things (IoT) connects physical everyday devices—streetlights, water pumps, air monitors, and medical monitors—to computing networks so they can share data and react intelligently.",
          "An IoT system consists of three main elements: 1. Sensors (collect raw physical data like temperature, smoke, or soil moisture); 2. Computing Controllers / AI Edge Nodes (analyze the incoming telemetry against target thresholds); 3. Actuators (physical mechanisms like electric valves, motors, cooling fans, and sirens that take physical action).",
          "In modern Smart Agriculture, automated irrigation systems place capacitive soil sensors in crop roots. If soil moisture drops below 30%, the system automatically opens the drip valve, saving millions of liters of freshwater.",
          "In Disaster Management, river ultrasonic level sensors broadcast real-time telemetry to municipal servers. If flood levels cross emergency markers, automated sirens sound and emergency barriers close automatically."
        ],
        reviewQuestions: [
          { q: "What is the difference between an IoT Sensor and an IoT Actuator?", a: "A sensor reads information from the physical environment (Input); an actuator performs a physical mechanical action in the environment (Output)." },
          { q: "How does AI make a smart city more energy-efficient than traditional cities?", a: "By dynamically dimming streetlights when streets are empty, optimizing bus routes based on passenger density, and cooling buildings only when rooms are occupied." }
        ]
      },
      {
        unitNumber: "Unit 4",
        title: "Introduction to Computer Vision & Pixel Grids",
        competencies: "Understand digital pixel representations, RGB color channels, and edge detection.",
        summary: "Digital images are two-dimensional matrices of numbers from 0 (black) to 255 (white). Computers apply 3x3 convolution kernels to detect edges, shapes, and contours without human intervention.",
        keyConcepts: ["Pixel Coordinates (X, Y)", "Grayscale & RGB Depth", "Convolution Kernels", "Edge Features"],
        matchingLessonId: "C6-04",
        chapterContent: [
          "To human eyes, a digital photograph looks like a smooth picture of a dog or a flower. But to a computer's processor, every image is simply a 2D grid (matrix) of colored dots called Pixels (Picture Elements).",
          "In Grayscale images, each pixel is stored as a single number between 0 and 255, where 0 represents pure pitch black, 255 represents blinding white, and numbers in between represent intermediate shades of gray.",
          "In Color images, every pixel contains three separate numerical color channels: Red, Green, and Blue (RGB). By blending intensities from 0 to 255 across these three channels, a screen can display over 16.7 million distinct colors (256 × 256 × 256).",
          "To recognize objects, computer vision algorithms slide small 3×3 mathematical grids called Convolution Kernels across the image. By calculating the difference between adjacent pixel values, kernels detect sudden changes in brightness—which correspond to object edges, corners, and contours!"
        ],
        reviewQuestions: [
          { q: "What color is represented by RGB value (255, 0, 0)?", a: "Pure bright Red (maximum red with zero green and zero blue)." },
          { q: "How does a computer vision algorithm detect an edge between a white shirt and a dark background?", a: "It detects a steep numerical drop from high pixel values (~240) to low pixel values (~20) across neighboring coordinates." }
        ]
      }
    ]
  },
  {
    id: "cbse-ai-class7",
    title: "CBSE Class 7 Artificial Intelligence Student Handbook",
    grade: "Class 7",
    code: "CBSE Skill Education • CTAI_Pri7SH (2026-27)",
    icon: "📗",
    color: "#059669",
    officialPdfUrl: "https://cbseacademic.nic.in/web_material/CurriculumMain27/CTAI_Pri7SH_2026-27.pdf",
    description: "Intermediate AI guide covering algorithmic bias, dataset diversity, computer vision convolutions, Natural Language Processing tokenization, and mathematics for AI.",
    units: [
      {
        unitNumber: "Unit 1",
        title: "AI Ethics, Algorithmic Bias & Fair Datasets",
        competencies: "Identify bias in historical training data and design inclusive datasets.",
        summary: "Machine learning models mirror whatever biases exist in their training data. Class imbalance, unrepresentative lighting, or skewed demographic samples lead to unfair decisions.",
        keyConcepts: ["Historical & Algorithmic Bias", "Class Imbalance", "Dataset Representation", "Responsible AI Governance"],
        matchingLessonId: "C7-01",
        chapterContent: [
          "Artificial intelligence algorithms are not inherently moral or fair; they are mathematical mirrors that reflect the data they are trained on.",
          "Algorithmic Bias occurs when an AI system produces systematically prejudiced results. For example, if a facial recognition camera is trained on 9,000 photos of light-skinned individuals and only 100 photos of dark-skinned individuals, the model will struggle severely with dark-skinned faces in the real world.",
          "Class Imbalance is a primary cause of AI failure. If a medical AI sees 95 healthy scans and only 5 tumor scans, an algorithm that blindly guesses 'Healthy' every time will achieve a deceptive 95% accuracy score while failing every sick patient!",
          "Responsible AI development requires inclusive dataset curation, auditing training distributions across diverse lighting, demographics, and accents, and always keeping a human in the loop for high-stakes decisions."
        ],
        reviewQuestions: [
          { q: "Why is 95% accuracy not always proof of a good machine learning model?", a: "If the test dataset is 95% Class A and 5% Class B, a dummy model that always predicts Class A gets 95% accuracy while completely failing Class B." },
          { q: "What should an engineer do if their vision model fails in dim lighting?", a: "Collect and augment training examples under low-light, shadow, and back-lit conditions to train feature invariance." }
        ]
      },
      {
        unitNumber: "Unit 2",
        title: "Computer Vision: Kernels, Sobel Edge Filters & Shapes",
        competencies: "Apply 3x3 convolution matrices to image matrices and compute geometric circularity.",
        summary: "Convolutional layers slide mathematical filters across pixels to create feature maps. Sobel vertical filters highlight columns, horizontal filters detect rows, and contour tracing finds object boundaries.",
        keyConcepts: ["Sobel Edge Detector", "Feature Maps", "Contour Perimeter & Area", "Circularity Ratios"],
        matchingLessonId: "C7-03",
        chapterContent: [
          "Convolutional Neural Networks (CNNs) are the backbone of modern vision systems in self-driving cars, drone navigation, and medical scanners.",
          "A 3×3 Convolution Kernel is a matrix of weights. The Vertical Sobel Kernel [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]] calculates horizontal gradients; because left weights are negative and right weights are positive, uniform flat areas cancel out to zero, while vertical borders produce large luminous positive values.",
          "Geometric Contour Analysis: After edge extraction, vision engines trace closed perimeter curves. By computing the Circularity Ratio C = (4π × Area) / (Perimeter²), the computer mathematically proves shape identity: a perfect circle yields C ≈ 1.0, a square yields C ≈ 0.785, and a triangle yields C ≈ 0.605."
        ],
        reviewQuestions: [
          { q: "What output does a flat, uniformly white 3x3 pixel patch produce when multiplied by a Sobel kernel?", a: "Zero (0), because the positive and negative weights sum to zero when all neighbor pixels are identical." },
          { q: "Why is circularity ratio invariant to scale (size of the circle)?", a: "Because area scales quadratically (r²) and perimeter squared also scales quadratically (2πr)² = 4π²r², canceling out the radius!" }
        ]
      },
      {
        unitNumber: "Unit 3",
        title: "Natural Language Processing (NLP) & Sentiment Analysis",
        competencies: "Tokenize text, filter grammatical stop words, and classify emotional polarity.",
        summary: "How search engines and chatbots process human language: tokenizing sentences into individual words, removing common stop words ('the', 'is', 'at'), extracting keyword stems, and calculating sentiment scores.",
        keyConcepts: ["Sentence Tokenization", "Stop Word Removal", "TF-IDF Keywords", "Sentiment Polarity"],
        matchingLessonId: "C7-05",
        chapterContent: [
          "Human language is messy, nuanced, and full of idioms. Natural Language Processing (NLP) is the subfield of AI that translates raw text and speech into structured mathematical representations.",
          "The first step is Tokenization: breaking a paragraph into sentences, and sentences into individual word tokens. Punctuation is stripped and words are lowercased.",
          "The second step is Stop-Word Filtering: common functional words like 'the', 'is', 'at', 'which', and 'on' appear frequently but carry very little topical meaning. Removing them reduces data size by up to 40% without losing core information.",
          "Sentiment Analysis calculates polarity scores: words with positive valence ('helpful', 'speedy', 'delightful') add positive weights (+1.0), while negative terms ('broken', 'terrible', 'frustrating') add negative weights (-1.0). Customer support bots use this to instantly escalate angry customer complaints."
        ],
        reviewQuestions: [
          { q: "Name three common English stop words that an NLP search engine filters out.", a: "'The', 'is', 'and' (or 'in', 'on', 'at')." },
          { q: "How can a sentiment analyzer be tricked by sarcasm like 'Oh great, another flat tire'?", a: "The word 'great' has a positive dictionary weight, but in context it expresses frustration. Modern transformer models examine context words to detect sarcasm." }
        ]
      },
      {
        unitNumber: "Unit 4",
        title: "Mathematics & Statistics for Machine Learning",
        competencies: "Understand Cartesian coordinates, Euclidean distance, and probability weights.",
        summary: "Computer vision and ML classifiers rely on simple mathematics: calculating Euclidean distance between color vectors ΔE = √((R-Rt)² + (G-Gt)² + (B-Bt)²) to recognize objects in camera frames.",
        keyConcepts: ["Euclidean Distance", "Probability Distributions", "Feature Vectors", "Centroids"],
        matchingLessonId: "C7-06",
        chapterContent: [
          "Every item in a machine learning system is transformed into a list of numbers called a Feature Vector. For example, a fruit can be described as [Weight in grams, Color Hue, Sweetness score].",
          "Euclidean Distance measures the straight-line distance between two points in feature space using the Pythagorean Theorem: Distance = √((x₂ - x₁)² + (y₂ - y₁)²). If a mystery fruit's vector is closer to the Apple cluster than the Orange cluster, the AI classifies it as an Apple!",
          "In camera color tracking, our vision engine compares the RGB values of each camera pixel against target values using ΔE = √((R - Rt)² + (G - Gt)² + (B - Bt)²). Pixels with a distance below threshold are identified as the tracked object.",
          "Softmax Probability converts raw distance scores into percentage confidences that always sum to exactly 100% (1.0), giving students clear confidence meters."
        ],
        reviewQuestions: [
          { q: "What mathematical theorem is Euclidean distance derived from?", a: "The Pythagorean Theorem (a² + b² = c²)." },
          { q: "If point A is (2, 3) and point B is (5, 7), what is the Euclidean distance between them?", a: "Distance = √((5-2)² + (7-3)²) = √(3² + 4²) = √(9 + 16) = √25 = 5.0 units." }
        ]
      }
    ]
  },
  {
    id: "cbse-ai-class8",
    title: "CBSE Class 8 Artificial Intelligence Student Handbook",
    grade: "Class 8",
    code: "CBSE Skill Education • CTAI_Pri8SH (2026-27)",
    icon: "📕",
    color: "#dc2626",
    officialPdfUrl: "https://cbseacademic.nic.in/web_material/CurriculumMain27/CTAI_Pri8SH_2026-27.pdf",
    description: "Advanced middle school AI curriculum: supervised vs unsupervised machine learning, artificial neural network perceptrons, model evaluation metrics, and generative AI safety.",
    units: [
      {
        unitNumber: "Unit 1",
        title: "Supervised, Unsupervised & Reinforcement Learning",
        competencies: "Compare classification, regression, clustering, and policy reward feedback.",
        summary: "Supervised learning trains on labeled inputs; Unsupervised learning discovers hidden patterns in unlabeled data via clustering; Reinforcement learning trains agents using rewards and penalties.",
        keyConcepts: ["Labeled Training Data", "K-Means Clustering", "Agent Reward Functions", "Decision Boundaries"],
        matchingLessonId: "C8-01",
        chapterContent: [
          "Machine learning algorithms are organized into three primary paradigms:",
          "1. Supervised Learning: The algorithm is provided with both the input features AND the correct output labels (e.g. 10,000 photos explicitly labeled 'Dog' or 'Cat'). The model learns a decision boundary separating the classes.",
          "2. Unsupervised Learning: The algorithm receives raw data WITHOUT any labels. It discovers natural geometric clusters based on feature similarities (e.g., grouping store customers by buying habits).",
          "3. Reinforcement Learning: An autonomous agent learns by interacting with an environment through Trial and Error. Actions that move closer to the goal receive positive rewards (+10), while collisions receive penalties (-50). Over thousands of attempts, the agent discovers an optimal policy—just like how game-playing AI masters chess and video games."
        ],
        reviewQuestions: [
          { q: "Which learning paradigm is used to train an autonomous Mars Rover to navigate craters?", a: "Reinforcement Learning (or a blend with Supervised vision), using rewards for traveling forward and penalties for getting stuck." },
          { q: "Give a real-world example of Unsupervised Clustering.", a: "Grouping news articles by topic without human tags, or grouping stars in astronomy by spectral emission." }
        ]
      },
      {
        unitNumber: "Unit 2",
        title: "Artificial Neural Networks & The Biological Perceptron",
        competencies: "Calculate neuron weighted sums z = Σ(w_i * x_i) + b and activation functions.",
        summary: "Modeled after biological brain neurons: inputs are multiplied by synaptic weights, summed with a threshold bias in the cell body, and passed through an activation function (sigmoid, step, ReLU) to fire down the axon.",
        keyConcepts: ["Weights & Biases", "Neuron Soma & Axon", "Sigmoid & ReLU Activation", "Forward Propagation"],
        matchingLessonId: "C8-03",
        chapterContent: [
          "In the biological human brain, approximately 86 billion interconnected neurons transmit electrical signals through dendrites, synapses, and axons.",
          "An Artificial Neuron (the Perceptron, invented by Frank Rosenblatt) mathematically mimics this biological mechanism:",
          "1. Input Signals (x₁, x₂, x₃) represent incoming data (e.g., weather conditions, camera pixel intensities).",
          "2. Synaptic Weights (w₁, w₂, w₃) determine how important each input is. Strong positive weights amplify signals, while negative weights inhibit them.",
          "3. Weighted Sum (z = w₁x₁ + w₂x₂ + w₃x₃ + b): The cell body (soma) calculates the dot product of inputs and weights, adding a threshold bias (b).",
          "4. Activation Function: The raw sum z is passed through a non-linear function: Step Function (0 or 1), Sigmoid (smooth S-curve between 0.0 and 1.0 representing probability), or ReLU (max(0, z)). If the activation exceeds threshold, the neuron FIRES down its axon to downstream layers!"
        ],
        reviewQuestions: [
          { q: "If x₁=1, w₁=2.0, x₂=1, w₂=1.0, and bias b=-2.5, what is the weighted sum z?", a: "z = (1 × 2.0) + (1 × 1.0) + (-2.5) = 2.0 + 1.0 - 2.5 = 0.5. Since z > 0, a step activation neuron will FIRE." },
          { q: "Why are activation functions essential in deep neural networks?", a: "Without non-linear activation functions, stacking 100 neural layers would still mathematically reduce to a simple linear equation that cannot solve complex problems." }
        ]
      },
      {
        unitNumber: "Unit 3",
        title: "Evaluating AI Models: Confusion Matrix, Precision & Recall",
        competencies: "Compute True Positives, False Positives, Precision, Recall, and F1-Scores.",
        summary: "Accuracy alone can be misleading when datasets are imbalanced. A confusion matrix breaks results into True Positives (TP), False Positives (FP), False Negatives (FN), and True Negatives (TN) to evaluate reliability.",
        keyConcepts: ["Confusion Matrix", "Type 1 vs Type 2 Errors", "Precision vs Recall Tradeoff", "F1-Score Harmonization"],
        matchingLessonId: "C8-05",
        chapterContent: [
          "When evaluating a classification model, four outcomes are recorded in a 2×2 grid called the Confusion Matrix:",
          "• True Positive (TP): Reality was YES, and AI predicted YES (e.g. sick patient correctly identified).",
          "• False Positive (FP / Type 1 Error): Reality was NO, but AI predicted YES (e.g. healthy patient falsely flagged as sick—a false alarm).",
          "• False Negative (FN / Type 2 Error): Reality was YES, but AI predicted NO (e.g. a dangerous tumor was missed—a critical failure!).",
          "• True Negative (TN): Reality was NO, and AI predicted NO (e.g. healthy person confirmed healthy).",
          "Precision measures purity: TP / (TP + FP) — 'Out of all cases the AI flagged as positive, how many were actually positive?'",
          "Recall (Sensitivity) measures completeness: TP / (TP + FN) — 'Out of all actual positive cases in reality, how many did the AI successfully catch?'",
          "The F1-Score calculates the harmonic mean: 2 × (Precision × Recall) / (Precision + Recall) to give a balanced metric."
        ],
        reviewQuestions: [
          { q: "In airport explosive detection, is High Precision or High Recall more important?", a: "High Recall is critical: we cannot afford a False Negative (letting a real threat through), even if it causes a few False Alarms." },
          { q: "In spam email filtering, why is High Precision desired?", a: "Because a False Positive means an important real email from your school or family gets sent to the trash folder!" }
        ]
      },
      {
        unitNumber: "Unit 4",
        title: "Generative AI, Large Language Models & Responsible Governance",
        competencies: "Understand next-token prediction, prompt engineering, deepfake risks, and 4Ws ethical scoping.",
        summary: "Generative models produce new text, images, and code through probability distributions. Responsible AI requires human-in-the-loop governance, deepfake watermarking, privacy protection, and transparent source citations.",
        keyConcepts: ["Prompt Engineering & Persona", "Next-Token Probability", "Deepfake Watermarking", "Human-in-the-Loop Governance"],
        matchingLessonId: "C8-08",
        chapterContent: [
          "Generative AI models (such as ChatGPT, Claude, Midjourney, and Gemini) do not retrieve pre-written human sentences from a database; they generate novel text and imagery by calculating statistical probability distributions across billions of parameters.",
          "In Large Language Models (LLMs), generation works through Next-Token Prediction: given a prompt, the model calculates the most statistically probable next syllable or word based on its training on vast libraries of human literature and code.",
          "Prompt Engineering is the skill of structuring instructions with Role / Persona, Clear Context, Constraints, and Output Format to elicit high-quality responses while preventing hallucinations.",
          "Responsible AI Safety: Synthetic media introduces severe risks including deepfakes, disinformation, and copyright infringement. Modern responsible AI requires cryptographically embedded watermarks (C2PA standard), strict safety guardrails, and human-in-the-loop verification."
        ],
        reviewQuestions: [
          { q: "What does 'hallucination' mean in generative AI?", a: "When an AI model generates factually incorrect information with high confidence because it sounds statistically plausible." },
          { q: "What are the key elements of an effective engineering prompt?", a: "Role/Persona, Clear Context, Specific Task, Constraints (e.g. word count, tone), and Output Structure." }
        ]
      }
    ]
  },
  {
    id: "cbse-ctai-framework",
    title: "CBSE CT & AI Master Curriculum Framework (Classes 3–8)",
    grade: "Classes 3–8",
    code: "Official CBSE Framework • 2026-27 Policy",
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
        matchingLessonId: "C3-01",
        chapterContent: [
          "Computational Thinking is not about thinking like a computer; it is a problem-solving methodology that empowers humans to formulate problems so clearly that a computer can assist in executing them.",
          "Decomposition breaks an overwhelming challenge (like organizing a school festival or coding a video game) into discrete, self-contained sub-tasks (decorations, tickets, music, food).",
          "Pattern Recognition identifies shared characteristics among different problems. Once you know how to sort numbers from smallest to largest, you can use the exact same logic to sort books alphabetically or students by height."
        ],
        reviewQuestions: [
          { q: "How would you decompose the task of programming a self-driving car game?", a: "1. Car steering mechanics; 2. Track road boundaries; 3. Obstacle collision detection; 4. Lap timer and score counter." }
        ]
      },
      {
        unitNumber: "Domain 2",
        title: "Algorithmic Thinking & Flowchart Logic",
        competencies: "Express clear step-by-step instructions with sequence, conditionals, and loops.",
        summary: "Visualizing procedural logic through directional arrow grids, standard flowchart shapes (terminators, decisions, operations), and block-based Scratch code.",
        keyConcepts: ["Sequential Execution", "Conditionals (If-Then-Else)", "Finite Loops", "Debugging"],
        matchingLessonId: "C4-01",
        chapterContent: [
          "An algorithm is an unambiguous, finite sequence of step-by-step instructions that transforms inputs into outputs.",
          "Conditionals allow programs to make decisions based on changing conditions: IF (Battery < 20%) THEN (Return to Charging Dock) ELSE (Continue Cleaning).",
          "Loops eliminate redundancy. Instead of writing 'Move Forward' 100 times, a REPEAT 100 loop executes the instruction with maximum efficiency."
        ],
        reviewQuestions: [
          { q: "What standard flowchart shape represents a decision or conditional branch?", a: "A diamond shape with two exit branches (Yes / No)." }
        ]
      },
      {
        unitNumber: "Domain 3",
        title: "Data Representation & Visual Analytics",
        competencies: "Collect, sanitize, and interpret numerical and categorical datasets.",
        summary: "Progressing from tactile sorting to frequency tally charts, bar graphs, Cartesian scatter plots, and multi-dimensional matrices.",
        keyConcepts: ["Categorical vs Numerical Data", "Data Cleaning", "Bar Charts & Scatter Plots", "Trends"],
        matchingLessonId: "C5-01",
        chapterContent: [
          "Data is the fuel of artificial intelligence. Without clean, structured data, machine learning cannot function.",
          "Categorical Data groups observations into discrete labels (e.g. types of vehicles: Car, Bus, Bicycle), while Numerical Data measures quantities (e.g. vehicle speed in km/h).",
          "Data Visualization transforms raw tabular numbers into intuitive visual forms—such as bar graphs and scatter plots—enabling humans and algorithms to detect outliers, clusters, and correlations instantly."
        ],
        reviewQuestions: [
          { q: "What is an outlier in a dataset?", a: "A data point that deviates drastically from all other observations (e.g., a student height recorded as 500 cm due to a typing typo)." }
        ]
      },
      {
        unitNumber: "Domain 4",
        title: "AI4K12 Five Big Ideas of Artificial Intelligence",
        competencies: "Apply Perception, Representation & Reasoning, Learning, Natural Interaction, and Societal Impact.",
        summary: "The globally recognized AI education framework: 1. Perception ➔ 2. Representation & Reasoning ➔ 3. Learning ➔ 4. Natural Interaction ➔ 5. Societal Impact.",
        keyConcepts: ["The 5 Big Ideas", "Ethical Technology Use", "Child Safety & Privacy", "Inclusive Design"],
        matchingLessonId: "C6-01",
        chapterContent: [
          "Developed by the Association for the Advancement of Artificial Intelligence (AAAI) and the Computer Science Teachers Association (CSTA), the AI4K12 framework establishes 5 foundational pillars for AI education:",
          "1. Perception: Computers perceive the world using digital sensors to extract meaning from raw sensory inputs.",
          "2. Representation & Reasoning: Computers construct internal mathematical models and graph representations to plan solutions.",
          "3. Learning: Machine learning algorithms automatically infer patterns from training data.",
          "4. Natural Interaction: Intelligent agents combine speech recognition, facial expression reading, and NLP to interact naturally with humans.",
          "5. Societal Impact: AI technology has profound social consequences; developers must ensure fairness, safety, environmental sustainability, and cultural inclusion."
        ],
        reviewQuestions: [
          { q: "Which AI4K12 Big Idea covers self-driving car cameras and microphone speech recognition?", a: "Big Idea 1: Perception." }
        ]
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
        matchingLessonId: "C6-02",
        chapterContent: [
          "Effective school computer lab pedagogy relies on Experiential, Inquiry-Based Learning: students should first touch, experiment, and observe cause-and-effect in simulations before formal definitions are memorized.",
          "Pair Programming: Pair students as 'Pilot' (controlling mouse/input) and 'Copilot' (reviewing logic and guiding strategy), swapping roles every 15 minutes.",
          "Zero-PII Privacy Compliance: In accordance with child data protection laws, school lab PCs must never require student logins, emails, or personal photo uploads. All webcam frames in the Vision Lab must process strictly in volatile RAM."
        ],
        reviewQuestions: [
          { q: "Why is Pair Programming recommended in school computer labs?", a: "It encourages verbal reasoning, reduces student frustration during debugging, and doubles peer engagement." }
        ]
      },
      {
        unitNumber: "Section 2",
        title: "Unplugged Classroom Demonstrations & Activity Cards",
        competencies: "Facilitate kinesthetic AI concepts without requiring computer screens.",
        summary: "Physical classroom roleplay games: Human Robot stage choreographing paper Scratch blocks, Card Sorting Classifiers for decision trees, and Flashcard Training sets for machine learning bias.",
        keyConcepts: ["Kinesthetic Learning", "Card Sorting Games", "Roleplay Scenarios", "Tangible Models"],
        matchingLessonId: "C7-01",
        chapterContent: [
          "Unplugged activities reinforce abstract computational concepts using physical movement, paper cards, and physical classroom objects:",
          "• Human Robot: One student wears a cardboard robot helmet and moves along floor tiles only when classmates hold up sequential arrow cards.",
          "• Mystery Feature Card Sorter: Divide the class into teams. Show students 10 drawings of fictional alien creatures with differing horn counts and leg numbers to illustrate decision tree splitting.",
          "• Human Neural Network: Students represent individual neurons, passing paper token signals to each other only when their hand token sum exceeds a threshold number."
        ],
        reviewQuestions: [
          { q: "What is the main benefit of an Unplugged activity before a computer simulation?", a: "It grounds abstract mathematical logic in tangible, memorable bodily experience." }
        ]
      },
      {
        unitNumber: "Section 3",
        title: "Assessment Rubrics & Continuous Comprehensive Evaluation",
        competencies: "Evaluate computational thinking portfolios, simulator problem-solving, and quizzes.",
        summary: "Formative evaluation rubrics focusing on algorithmic logic, debugging resilience, feature observation, and thoughtful ethical discussion rather than rote memorization.",
        keyConcepts: ["Formative Assessment", "Debugging Rubrics", "Portfolio Stars", "Self-Reflection"],
        matchingLessonId: "C8-05",
        chapterContent: [
          "Assessment in AI and Computational Thinking should prioritize Problem-Solving Resilience and Algorithmic Thinking over rote memorization of definitions.",
          "Rubric Criteria for Lab Evaluation: 1. Exploration Initiative (did the student test multiple parameter combinations?); 2. Debugging Persistence (when a simulation produced unexpected results, did they analyze where the logic failed?); 3. Ethical Awareness (can the student identify potential bias in data collection?)."
        ],
        reviewQuestions: [
          { q: "Why should formative assessment in coding evaluate debugging persistence?", a: "Because making errors and iteratively debugging is the core authentic skill of all real-world software engineers." }
        ]
      }
    ]
  }
];
