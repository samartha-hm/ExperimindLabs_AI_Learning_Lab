// Experimind AI Learning Lab — AI Tutorial Videos & Digital Learning Resources Hub
// Aligned with CBSE CT & AI (2026-27), Code.org, Khan Academy, BBC Learning, and MIT Scratch.
// Includes interactive video tutorials, digital learning cheatsheets, and hands-on comprehension checkpoints.

window.EXPERIMIND_VIDEOS = [
  {
    id: "vid-01",
    title: "Tutorial 01: What is Computational Thinking?",
    source: "Code.org & CS for All",
    youtubeId: "injJWiSA0pw",
    youtubeUrl: "https://www.youtube.com/watch?v=injJWiSA0pw",
    grades: "LKG – Class 3",
    gradeBand: "primary",
    duration: "4:35",
    mappedLessonId: "C2-02",
    icon: "🧩",
    keyConcepts: [
      "Decomposition: Breaking a giant problem into bite-sized, manageable pieces.",
      "Pattern Recognition: Spotting repeating shapes, colors, or rules.",
      "Abstraction: Focusing only on what matters most and ignoring distracting details.",
      "Algorithm Design: Writing clear, step-by-step instructions that anyone can follow."
    ],
    checkpoint: {
      q: "When a chef breaks down baking a cake into gathering ingredients, mixing batter, and baking, which Computational Thinking pillar is being used?",
      options: [
        "A) Abstraction (ignoring ingredients)",
        "B) Decomposition (breaking into smaller steps) ✅",
        "C) Infinite Loop (mixing forever)"
      ],
      correct: 1,
      feedback: "🎯 Correct! Decomposition breaks down a big, complex challenge into small, orderly sub-tasks."
    },
    learningResource: {
      notebookNotes: [
        "Computational Thinking is a superpower humans use to solve problems before writing code.",
        "Decomposition makes hard projects easy by dividing them into small jobs.",
        "Patterns help us reuse previous solutions for new challenges."
      ],
      labExperiment: "Launch Lesson C2-02 ('Pattern Train Architect') and identify repeating color blocks to complete the train track."
    },
    offlineAlternative: "Chalkboard Monster Drawing Game: Have one student describe how to draw a happy monster using only shapes and positions ('Draw a big circle, add two triangle ears') while classmates draw it without seeing the card."
  },
  {
    id: "vid-02",
    title: "Tutorial 02: What Is an Algorithm? Step-by-Step Logic",
    source: "BBC Learning & Barefoot Computing",
    youtubeId: "r_Rsu6Av1Vk",
    youtubeUrl: "https://www.youtube.com/watch?v=r_Rsu6Av1Vk",
    grades: "UKG – Class 3",
    gradeBand: "primary",
    duration: "2:30",
    mappedLessonId: "C1-03",
    icon: "👣",
    keyConcepts: [
      "Every daily routine—brushing teeth, tying shoes, making toast—is an algorithm.",
      "Computers follow instructions literally: if step 2 and step 3 are swapped, the program breaks!",
      "Debugging means testing our steps and fixing the exact instruction that went wrong."
    ],
    checkpoint: {
      q: "Why does a computer robot fail if you forget to tell it to 'open the door' before 'walk forward'?",
      options: [
        "A) Computers have common sense and will open it anyway",
        "B) Computers follow instructions strictly in order, so it bumps into the closed door! ✅",
        "C) The computer battery ran out"
      ],
      correct: 1,
      feedback: "🎯 Exactly right! Computers do exactly what we tell them, not what we meant to tell them. Sequential order is everything!"
    },
    learningResource: {
      notebookNotes: [
        "An algorithm is a precise sequence of steps with a clear beginning and end.",
        "Order matters: 'Put on socks, then shoes' is very different from 'Put on shoes, then socks'!",
        "Finding and fixing mistakes in an algorithm is called Debugging."
      ],
      labExperiment: "Launch Lesson C1-03 ('Robo-Maze: Guide Sparky Home') and arrange movement arrow cards in sequence to avoid obstacles."
    },
    offlineAlternative: "The 'Robot Teacher' Toothbrush Challenge: The teacher pretends to be a robot with a toothbrush. Students must shout out exact sequential steps; if they forget 'open cap first', the robot tries to squeeze toothpaste with the cap on!"
  },
  {
    id: "vid-03",
    title: "Tutorial 03: Input, Process & Output (IPO Cycle)",
    source: "LearningMole CS Series",
    youtubeId: "kQUcVMSgjq0",
    youtubeUrl: "https://www.youtube.com/watch?v=kQUcVMSgjq0",
    grades: "Classes 1 – 4",
    gradeBand: "primary",
    duration: "3:45",
    mappedLessonId: "C2-01",
    icon: "⚙️",
    keyConcepts: [
      "Every computing system follows the IPO Cycle: Input ➔ Process ➔ Output.",
      "Inputs are raw signals: keyboard presses, mouse clicks, camera frames, and microphone sound.",
      "Process is the calculation: math, logic comparisons, and decisions made in the CPU.",
      "Outputs are the results: screen pixels, speaker sound, robotic motor motion, and LEDs."
    ],
    checkpoint: {
      q: "When you press a piano key on a digital synthesizer and hear music, what is the 'Input'?",
      options: [
        "A) The sound coming out of the speaker",
        "B) The physical press of the key with your finger ✅",
        "C) The volume knob"
      ],
      correct: 1,
      feedback: "🎯 Spot on! Pressing the key is the Input; calculating the sound pitch is the Process; the speaker audio is the Output."
    },
    learningResource: {
      notebookNotes: [
        "Input = Data entering the computer.",
        "Process = The thinking/calculating work.",
        "Output = The visible or audible result."
      ],
      labExperiment: "Launch Lesson C2-01 ('The Input-Process-Output Kitchen') to route ingredients (Inputs) through blenders (Process) into smoothies (Output)."
    },
    offlineAlternative: "Input-Process-Output Classroom Chain: Three students stand at the front labeled INPUT, PROCESS, and OUTPUT. Classmates give Input two numbers (4 and 5), Process applies a secret rule ('Add and double'), and Output writes 18."
  },
  {
    id: "vid-04",
    title: "Tutorial 04: What is Scratch? Creative Block Programming",
    source: "MIT Media Lab / Scratch Team",
    youtubeId: "LjOfOQkpPnU",
    youtubeUrl: "https://www.youtube.com/watch?v=LjOfOQkpPnU",
    grades: "Classes 3 – 5",
    gradeBand: "prep",
    duration: "1:45",
    mappedLessonId: "C3-05",
    icon: "🐱",
    keyConcepts: [
      "Snap-together interlocking visual blocks eliminate syntax errors so students focus on pure logic.",
      "Combine Events ('when green flag clicked'), Motion ('move 10 steps'), and Loops ('repeat 10').",
      "Sprites are interactive on-screen characters that can move, speak, and detect collisions."
    ],
    checkpoint: {
      q: "Which block ensures that your code starts running when the green flag is clicked in Scratch?",
      options: [
        "A) An orange 'When Green Flag Clicked' Event Hat Block ✅",
        "B) A blue 'Turn 15 Degrees' block",
        "C) A purple 'Say Hello' block"
      ],
      correct: 0,
      feedback: "🎯 Awesome! Event hat blocks trigger scripts when actions occur, like clicking the green flag or pressing the spacebar."
    },
    learningResource: {
      notebookNotes: [
        "Scratch was created by MIT Media Lab to teach computational creativity.",
        "Blocks snap together only when they are compatible, preventing syntax crashes.",
        "Coordinates (X, Y) control where your sprite appears on the 480x360 stage."
      ],
      labExperiment: "Launch Lesson C3-05 ('Intro to Block Coding: Events & Motion') or open Scratch 3.0 Desktop offline from the Coding Apps tab."
    },
    offlineAlternative: "Paper Block Choreography: Students hold up giant printed paper Scratch blocks (Move 2 Steps, Turn 90°, Jump) to program a classmate across the room."
  },
  {
    id: "vid-05",
    title: "Tutorial 05: How AI Works: Introduction to Artificial Intelligence",
    source: "Code.org AI Literacy Series",
    youtubeId: "Ok-xpKjKp2g",
    youtubeUrl: "https://www.youtube.com/watch?v=Ok-xpKjKp2g",
    grades: "Classes 5 – 8",
    gradeBand: "middle",
    duration: "1:35",
    mappedLessonId: "C6-01",
    icon: "✨",
    keyConcepts: [
      "How AI differs from traditional programs by learning patterns from data instead of hardcoded rules.",
      "Core AI capabilities: computer vision perception, voice recognition, and decision making.",
      "Responsible AI: asking not just 'what can computers do?' but 'what SHOULD computers do?'."
    ],
    checkpoint: {
      q: "How does a machine learning AI learn to recognize handwritten numbers?",
      options: [
        "A) A human writes a 10,000-page rulebook for every possible curve",
        "B) It observes thousands of labeled handwriting examples and discovers patterns automatically ✅",
        "C) It searches Google every millisecond"
      ],
      correct: 1,
      feedback: "🎯 Correct! Machine learning infers statistical features from training examples, rather than relying on human rulebooks."
    },
    learningResource: {
      notebookNotes: [
        "Traditional Coding: Rules + Data = Answers.",
        "Machine Learning AI: Data + Answers = Rules!",
        "AI is an assistant to amplify human creativity, not replace human judgment."
      ],
      labExperiment: "Launch Lesson C6-01 ('Natural vs Artificial Intelligence Explorer') to compare human sensory perception with AI algorithms."
    },
    offlineAlternative: "Rule vs Pattern Debate: Show a handwritten digit '8' and a tic-tac-toe grid. Ask: 'Which one can we solve with 4 IF-THEN rules, and which one requires training on thousands of handwriting styles?'"
  },
  {
    id: "vid-06",
    title: "Tutorial 06: How Does Machine Learning Work?",
    source: "Code.org & Khan Academy",
    youtubeId: "KHbwOetbmbs",
    youtubeUrl: "https://www.youtube.com/watch?v=KHbwOetbmbs",
    grades: "Classes 5 – 8",
    gradeBand: "middle",
    duration: "2:53",
    mappedLessonId: "C5-06",
    icon: "📈",
    keyConcepts: [
      "Supervised learning: feeding labeled examples into a model so it learns decision boundaries.",
      "Feature extraction: converting real-world traits (size, sweetness, color) into numerical vectors.",
      "Unseen Test Set: evaluating models on new data to test genuine generalization."
    ],
    checkpoint: {
      q: "If an AI is tested using the EXACT same images it was trained on, what are you measuring?",
      options: [
        "A) True generalization to the real world",
        "B) Memorization (overfitting), not true learning! ✅",
        "C) Faster internet speed"
      ],
      correct: 1,
      feedback: "🎯 Exactly right! Testing on training data only measures memorization. A real test must use fresh, unseen examples!"
    },
    learningResource: {
      notebookNotes: [
        "Training Data: The examples the computer studies.",
        "Test Data: New examples kept secret until exam time.",
        "Overfitting happens when an AI memorizes noise instead of general patterns."
      ],
      labExperiment: "Launch Lesson C5-06 ('How Machines Learn from Examples') to adjust training data points and observe decision boundary curves."
    },
    offlineAlternative: "Guess the Fruit on the Chalkboard: Plot Sweetness (1-10) on the X-axis and Crunchiness (1-10) on the Y-axis. Have students plot Apples (8,9) vs Lemons (2,4) and classify mystery fruits."
  },
  {
    id: "vid-07",
    title: "Tutorial 07: Teachable Machine: Gathering Training Data",
    source: "Google Creative Lab",
    youtubeId: "DFBbSTvtpy4",
    youtubeUrl: "https://www.youtube.com/watch?v=DFBbSTvtpy4",
    grades: "Classes 5 – 8",
    gradeBand: "middle",
    duration: "2:08",
    mappedLessonId: "C8-06",
    icon: "📷",
    keyConcepts: [
      "Grouping training samples into distinct, well-defined classes (Class A, Class B, Class C).",
      "Why capturing varied angles, distances, and lighting makes an AI model robust.",
      "Class Balance: avoiding dataset skew where one category has 10x more samples than others."
    ],
    checkpoint: {
      q: "What happens if you record 100 samples for 'Thumbs Up' with a white background, and 100 samples for 'Thumbs Down' with a brick wall?",
      options: [
        "A) The AI will learn the hand gestures perfectly",
        "B) The AI might accidentally learn to classify the background wall instead of your hand! ✅",
        "C) The webcam will overheat"
      ],
      correct: 1,
      feedback: "🎯 A classic AI trap! Background bias occurs when background features correlate with class labels. Always vary backgrounds!"
    },
    learningResource: {
      notebookNotes: [
        "A class is a category of things we want the AI to distinguish.",
        "Capture samples from multiple angles, distances, and lighting conditions.",
        "Equal sample counts prevent majority-class bias."
      ],
      labExperiment: "Open our Magic AI Camera (Tab 7: Teachable Sorter) and capture live webcam samples to train your own 3-class classifier in RAM!"
    },
    offlineAlternative: "Offline Flashcard Classifier: Have students draw 10 fictional alien creatures on flashcards with varied eye counts and horns, then test classmates on identifying the secret rule."
  },
  {
    id: "vid-08",
    title: "Tutorial 08: Computer Vision & Seeing with Pixels",
    source: "Code.org Computer Vision Series",
    youtubeId: "kwcillcWOg0",
    youtubeUrl: "https://www.youtube.com/watch?v=kwcillcWOg0",
    grades: "Classes 6 – 8",
    gradeBand: "middle",
    duration: "1:54",
    mappedLessonId: "C6-04",
    icon: "🖼️",
    keyConcepts: [
      "Digital images are 2D grids (matrices) of numerical pixels from 0 (black) to 255 (white).",
      "Color images blend 3 numbers per pixel: Red, Green, and Blue (RGB).",
      "Convolution filters slide across pixels to detect edges, outlines, and textures."
    ],
    checkpoint: {
      q: "How does a computer vision algorithm detect the edge of a coffee cup on a table?",
      options: [
        "A) By feeling the temperature of the cup",
        "B) By detecting a sudden mathematical jump in pixel numbers between neighbor coordinates ✅",
        "C) It guesses randomly"
      ],
      correct: 1,
      feedback: "🎯 Correct! An edge is mathematically defined as a high gradient (sudden jump) between adjacent pixel values in the matrix."
    },
    learningResource: {
      notebookNotes: [
        "Every picture is a matrix of numbers.",
        "Grayscale: 0 = Black, 255 = White.",
        "RGB: Red (0-255), Green (0-255), Blue (0-255).",
        "Kernels: Small 3x3 matrices that filter and sharpen image features."
      ],
      labExperiment: "Launch Lesson C6-04 ('Computer Vision: Feature Extraction & Pixels') and toggle pixels in the 6x6 matrix to see the feature map update."
    },
    offlineAlternative: "Human Pixel Matrix: Draw a 5x5 grid on the floor. Hand students number cards (0 for dark shoes, 255 for white sneakers) and have an 'Observer' student outline where the contrast boundary lies."
  },
  {
    id: "vid-09",
    title: "Tutorial 09: AI Ethics, Dataset Bias & Fairness",
    source: "Code.org Ethics in AI",
    youtubeId: "x2mRoFNm22g",
    youtubeUrl: "https://www.youtube.com/watch?v=x2mRoFNm22g",
    grades: "Classes 6 – 8",
    gradeBand: "middle",
    duration: "3:24",
    mappedLessonId: "C7-06",
    icon: "⚖️",
    keyConcepts: [
      "Machine learning models inherit whatever biases exist in their training data.",
      "If historical data contains unfair human decisions, the AI will automate and amplify that unfairness.",
      "Auditing datasets for diversity, equity, and representation is an essential duty of all engineers."
    ],
    checkpoint: {
      q: "If an AI hiring tool is trained on 10 years of historical resumes where 90% of managers were men, what might the AI conclude?",
      options: [
        "A) It will fairly evaluate everyone based on skills alone",
        "B) It may develop a harmful bias against female applicants because of past data imbalance! ✅",
        "C) It will shut down automatically"
      ],
      correct: 1,
      feedback: "🎯 Exactly right! AI doesn't know right from wrong unless engineers actively audit and balance training data for fairness."
    },
    learningResource: {
      notebookNotes: [
        "Garbage In, Garbage Out: Skewed data produces biased AI.",
        "Engineers must inspect datasets for demographic and cultural diversity.",
        "Never deploy high-stakes AI systems without human oversight."
      ],
      labExperiment: "Launch Lesson C7-06 ('Dataset Bias & Algorithmic Auditing Lab') and balance training samples to lift accuracy above 90%."
    },
    offlineAlternative: "Fairness Audit Roleplay: Present students with a mock 'AI School Bus Seat Allocator' that was trained only on data from one neighborhood. Have students identify the bias and propose fair data rules."
  },
  {
    id: "vid-10",
    title: "Tutorial 10: How Natural Language Processing (NLP) Works",
    source: "Code.org & CrashCourse AI",
    youtubeId: "X-AWdfSFCHQ",
    youtubeUrl: "https://www.youtube.com/watch?v=X-AWdfSFCHQ",
    grades: "Classes 6 – 8",
    gradeBand: "middle",
    duration: "6:40",
    mappedLessonId: "C7-04",
    icon: "💬",
    keyConcepts: [
      "Natural Language Processing (NLP): Helping computers read, analyze, and generate human language.",
      "Tokenization splits text into individual words; Stop-word filtering removes filler words ('the', 'is').",
      "Sentiment analysis assigns numerical valence scores to detect happiness, urgency, or frustration."
    ],
    checkpoint: {
      q: "Why do search engines filter out common stop words like 'the', 'a', 'is', and 'at'?",
      options: [
        "A) To make room for advertisements",
        "B) Because they appear everywhere and carry very little specific search meaning ✅",
        "C) Because computers cannot read words with fewer than 3 letters"
      ],
      correct: 1,
      feedback: "🎯 Correct! Stop words are grammatical glue; filtering them out lets NLP engines focus on key semantic words like 'weather', 'robotics', and 'homework'."
    },
    learningResource: {
      notebookNotes: [
        "Tokenization = Slicing sentences into word tokens.",
        "Stop Words = Common filler words filtered out.",
        "Sentiment Score = Mathematical rating of emotion (positive vs negative)."
      ],
      labExperiment: "Launch Lesson C7-04 ('NLP: Tokenization & Sentiment Analysis Lab') to test sample customer sentences through the filter."
    },
    offlineAlternative: "Paper Next-Word Predictor Game: Write 'After school, the hungry puppy ran to the ___'. Have 15 students write one completion word, tally the frequencies, and explain how chatbots use probability."
  },
  {
    id: "vid-11",
    title: "Tutorial 11: Artificial Neural Networks & Perceptrons",
    source: "Code.org Neural Networks Series",
    youtubeId: "3oqxjPXbynE",
    youtubeUrl: "https://www.youtube.com/watch?v=3oqxjPXbynE",
    grades: "Classes 7 – 8",
    gradeBand: "middle",
    duration: "4:12",
    mappedLessonId: "C8-03",
    icon: "🧠",
    keyConcepts: [
      "Artificial Neural Networks (ANNs) are mathematically inspired by interconnected biological brain neurons.",
      "Inputs are multiplied by synaptic Weights, added together with a Bias in the cell body (soma).",
      "Activation functions (Sigmoid, ReLU, Step) determine whether the neuron fires a signal forward."
    ],
    checkpoint: {
      q: "In an artificial neuron, what role do the 'Weights' play?",
      options: [
        "A) They measure how heavy the computer hardware is",
        "B) They control the strength or importance of each input signal ✅",
        "C) They measure the electricity voltage"
      ],
      correct: 1,
      feedback: "🎯 Exactly! Weights amplify important inputs and dampen irrelevant inputs, just like biological brain synapses!"
    },
    learningResource: {
      notebookNotes: [
        "Neuron Formula: z = (x1 × w1) + (x2 × w2) + (x3 × w3) + bias.",
        "Weights (w) = Synapse strengths.",
        "Bias (b) = The threshold required to fire.",
        "Activation = The final output sent down the axon."
      ],
      labExperiment: "Launch Lesson C8-03 ('Neural Networks & Perceptron Playground') and adjust weights and bias to make the neuron fire."
    },
    offlineAlternative: "Human Neural Network Game: 4 students act as input sensors, 1 acts as the neuron soma, and 1 acts as output. The soma student adds numbers called out by inputs and holds up a green card only when sum > 10."
  },
  {
    id: "vid-12",
    title: "Tutorial 12: Generative AI, Large Language Models & Ethics",
    source: "CrashCourse AI & Code.org",
    youtubeId: "21eVegaVMtE",
    youtubeUrl: "https://www.youtube.com/watch?v=21eVegaVMtE",
    grades: "Classes 7 – 8",
    gradeBand: "middle",
    duration: "7:43",
    mappedLessonId: "C8-08",
    icon: "🎨",
    keyConcepts: [
      "Generative AI creates novel text, images, and audio by calculating probability distributions.",
      "Large Language Models (LLMs) predict the most statistically likely next tokens in sequence.",
      "Responsible Creation: Always verify facts to prevent hallucinations and cite sources transparently."
    ],
    checkpoint: {
      q: "Why must students always fact-check and verify information provided by Generative AI chatbots?",
      options: [
        "A) Because chatbots can 'hallucinate' plausible-sounding facts that are completely untrue! ✅",
        "B) Because chatbots are always 100% correct about everything",
        "C) Because the internet turns off at 6 PM"
      ],
      correct: 0,
      feedback: "🎯 Essential knowledge! Generative AI generates words by probability, not conscious truth. Always verify facts with trusted reference books!"
    },
    learningResource: {
      notebookNotes: [
        "Prompt Engineering: Giving clear Persona, Context, Task, and Constraints.",
        "Hallucination: When an AI generates fluent fiction as fact.",
        "Human in the loop: Humans must always review and take responsibility for AI work."
      ],
      labExperiment: "Launch Lesson C8-08 ('AI Ethics, Deepfake Detection & Human-in-the-Loop Governance') to audit synthetic media checklists."
    },
    offlineAlternative: "Classroom AI Responsibility Charter: Have students draft 5 rules for using AI tools responsibly in school (Rule 1: Never share personal secrets; Rule 2: Always double-check facts; Rule 3: Use AI for brainstorming, not copying)."
  }
];
