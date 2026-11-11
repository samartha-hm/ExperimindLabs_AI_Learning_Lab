window.EXPERIMIND_EXTERNAL_PLATFORMS = [
  {
    "id": "ext-scratch",
    "name": "Scratch 3.0 Desktop Editor",
    "developer": "MIT Media Lab / Scratch Foundation",
    "grades": "Classes 3 \u2013 8",
    "badge": "100% Offline Desktop App + Web",
    "icon": "\ud83d\udc31",
    "accentColor": "#f59e0b",
    "officialUrl": "https://scratch.mit.edu/download",
    "webLaunchUrl": "https://scratch.mit.edu/projects/editor/",
    "windowsStartMenuPath": "Start Menu \u2794 Scratch 3 \u2794 Scratch Desktop",
    "windowsExePath": "C:\\Program Files\\Scratch 3\\Scratch 3.exe",
    "learningObjective": "Design interactive stories, animations, and event-driven games using snap-together visual code blocks (motion, loops, conditionals, variables, and broadcasts) without syntax errors.",
    "gameplaySteps": [
      "Open Scratch 3 Desktop from the Windows Start Menu (or launch the sandboxed Web Editor below).",
      "Pick a Sprite character from the bottom-right Sprite Library and a stage Backdrop.",
      "Drag an orange 'when green flag clicked' block from Events into the center Scripting Area.",
      "Snap blue Motion blocks ('move 10 steps', 'turn 15 degrees') inside a 'repeat 10' loop and click the Green Flag to test your animation!"
    ],
    "teacherQuestions": [
      "What happens if we place 'move 10 steps' inside a 'forever' loop vs. a 'repeat 10' loop?",
      "How do Broadcast messages allow two sprites to talk to each other without touching?",
      "Where did you use a Variable in your game, and how does its value change when the player scores?"
    ],
    "offlineClassroomAlternative": "Unplugged Human Robot Stage: One student acts as the 'Sprite' standing on floor tiles while classmates hold up printed paper Scratch blocks (Move Forward, Turn Right 90\u00b0, Repeat 3 Times) to choreograph a dance sequence.",
    "licenseAndPrivacy": "License: BSD 3-Clause / GPLv2 (Open Source by Scratch Foundation). Privacy Audit: Scratch 3.0 Offline Desktop operates 100% locally with zero telemetry, zero student accounts, and local .sb3 file saving."
  },
  {
    "id": "ext-gcompris",
    "name": "GCompris Educational Software Suite",
    "developer": "KDE Community (Timoth\u00e9e Giet & Contributors)",
    "grades": "LKG \u2013 Class 4",
    "badge": "100% Offline Desktop Suite",
    "icon": "\ud83d\udc27",
    "accentColor": "#10b981",
    "officialUrl": "https://www.gcompris.net/downloads-en.html",
    "webLaunchUrl": "https://www.gcompris.net/index-en.html",
    "windowsStartMenuPath": "Start Menu \u2794 GCompris \u2794 Discover the Computer / Logic",
    "windowsExePath": "C:\\Program Files\\GCompris-Qt\\bin\\GCompris.exe",
    "learningObjective": "Master foundational mouse dexterity, keyboard recognition, visual pattern completion, maze navigation, and early algorithmic thinking across 150+ distraction-free activities.",
    "gameplaySteps": [
      "Launch GCompris from the Windows Start Menu (look for the orange airplane/penguin icon).",
      "For LKG/UKG: Click the Penguinwith-Computer icon ('Discover the Computer') and select 'Click and Draw' or 'Babyshapes'.",
      "For Classes 1\u20134: Click the Tangram/Gear icon ('Logic') and select 'Programming Maze' to guide Tux the Penguin to the fish using step-by-step instructions.",
      "Use the bottom bar's Sun/Moon or Dice icon to adjust difficulty levels for your grade tier."
    ],
    "teacherQuestions": [
      "In 'Programming Maze', how many forward steps did Tux need before turning right?",
      "When you used the 'Procedure / Loop' slot in Tux's maze, how many command blocks did you save?",
      "Which shape attribute (color, size, or outline) helped you solve the pattern train?"
    ],
    "offlineClassroomAlternative": "Unplugged Tux Floor Grid: Tape a 4x4 grid on the classroom floor, place a paper fish on one square, and have students lay down arrow flashcards to guide a classmate from Start to the Fish.",
    "licenseAndPrivacy": "License: GNU AGPLv3 (Free & Open Source KDE Software). Privacy Audit: 100% offline Windows executable, zero internet sockets required, zero advertisements, and zero personal data collection."
  },
  {
    "id": "ext-teachable",
    "name": "Google Teachable Machine",
    "developer": "Google Creative Lab",
    "grades": "Classes 5 \u2013 8",
    "badge": "Browser ML Lab (In-RAM Training)",
    "icon": "\ud83e\udde0",
    "accentColor": "#3b82f6",
    "officialUrl": "https://teachablemachine.withgoogle.com/",
    "webLaunchUrl": "https://teachablemachine.withgoogle.com/train",
    "windowsStartMenuPath": "Experimind Portal \u2794 AI Vision Lab (#vision/Class 8) for 100% Offline Training",
    "windowsExePath": "Built-in Offline Fallback: #vision/Class 8 (Live 3-Class Vision Trainer)",
    "learningObjective": "Train a real supervised machine learning model to classify images, sounds, or body poses in seconds using the 3-step AI workflow: Gather Examples \u2794 Train Model \u2794 Test & Export.",
    "gameplaySteps": [
      "If offline, click 'Open Built-in Offline Vision Trainer' to use Experimind's local 3-class trainer; if online with Teacher permission, launch Google Teachable Machine.",
      "Select 'Image Project \u2794 Standard Image Model'.",
      "Record 25\u201330 sample frames for 'Class 1' (e.g., Thumbs Up) and 25\u201330 frames for 'Class 2' (e.g., Open Palm).",
      "Click 'Train Model' and test live in the Preview panel by holding up different hand gestures or classroom objects to observe confidence percentages."
    ],
    "teacherQuestions": [
      "Why did the model make mistakes when you stood in front of a different background or dimmer lighting?",
      "How does adding more diverse training samples to Class 1 and Class 2 improve confidence and reduce bias?",
      "What is the difference between the Training Dataset and the unseen Test inputs you tried afterward?"
    ],
    "offlineClassroomAlternative": "Unplugged Flashcard Classifier: Divide the class into 'Training Team' and 'Test Team'. Show the Training Team 10 labeled drawings of fictional creatures ('Zorgs' vs 'Blips') so they infer the hidden feature rules, then test them on 5 mystery cards.",
    "licenseAndPrivacy": "License: Apache 2.0 (TensorFlow.js / Google Creative Lab). Privacy Audit: All webcam training frames stay in browser memory unless explicitly exported by the user; no login required."
  },
  {
    "id": "ext-blockly",
    "name": "Google Blockly Games",
    "developer": "Google Open Source Education",
    "grades": "Classes 2 \u2013 6",
    "badge": "Offline Bundle + Web Puzzles",
    "icon": "\ud83e\udde9",
    "accentColor": "#8b5cf6",
    "officialUrl": "https://github.com/google/blockly-games/wiki/offline",
    "webLaunchUrl": "https://blockly.games/",
    "windowsStartMenuPath": "DELIVERY\\Experimind_AI_Learning_Lab\\vendor\\blockly-games\\index.html",
    "windowsExePath": "Built-in Equivalent: #lesson/C3-03 & #lesson/C4-06 (RoboGrid Maze Engine)",
    "learningObjective": "Progress through 7 self-paced algorithmic puzzle worlds (Puzzle, Maze, Bird, Turtle, Movie, Music, and Pond) mastering loops, conditionals, angles, and JavaScript transition.",
    "gameplaySteps": [
      "Start with 'Puzzle' (Classes 1\u20132) to practice snapping blocks together by matching animal traits and leg counts.",
      "Open 'Maze' (Classes 2\u20135) and snap 'move forward', 'turn left', and 'repeat until goal' blocks to guide the astronaut.",
      " Notice the block counter badge: challenge yourself to solve Levels 5\u201310 using the fewest blocks possible!",
      "For Classes 5\u20136, open 'Bird' and 'Turtle' to explore multi-branch 'if / else if / else' angle conditions and geometric loops."
    ],
    "teacherQuestions": [
      "In Maze Level 6, how does a single 'repeat until' block replace ten separate 'move forward' blocks?",
      "When your astronaut hit a wall, how did watching the highlighted step help you debug the exact turn block?",
      "Look at the generated JavaScript code pop-up after completing a level\u2014how does it match your visual blocks?"
    ],
    "offlineClassroomAlternative": "Paper Blockly Maze Challenge: Distribute printed 6x6 grid worksheets with walls and a goal star. Students write a compact program in fewer than 5 lines using 'Repeat Until Goal' and 'If Path Left' paper strips.",
    "licenseAndPrivacy": "License: Apache 2.0 Open Source (Google). Privacy Audit: Downloadable static HTML/JS archive runs 100% offline from USB or local folder with zero external network calls or accounts."
  },
  {
    "id": "ext-codeorg",
    "name": "Code.org \u2014 Hour of AI & CS Fundamentals",
    "developer": "Code.org",
    "grades": "Classes 1 \u2013 8",
    "badge": "Guided AI & CS Tutorials",
    "icon": "\ud83e\udd16",
    "accentColor": "#ec4899",
    "officialUrl": "https://code.org/en-US/hour-of-ai",
    "webLaunchUrl": "https://code.org/en-US/hour-of-ai",
    "windowsStartMenuPath": "Experimind Portal \u2794 #lesson/C5-06 & #lesson/C7-06 (Offline AI for Oceans Equivalent)",
    "windowsExePath": "Built-in Offline Equivalent: ENG-07 Supervised ML & Bias Classifier Lab",
    "learningObjective": "Experience guided 45-minute tutorials on artificial intelligence, marine conservation classification ('AI for Oceans'), algorithmic sequencing, and ethical AI design.",
    "gameplaySteps": [
      "For 100% offline classrooms, launch Experimind's built-in 'Supervised ML & Bias Lab' (`#lesson/C5-06` or `#lesson/C7-06`).",
      "When online with Teacher confirmation, open Code.org's Hour of AI portal in an isolated tab.",
      "Train the conservation robot to distinguish fish from ocean trash by labeling training samples.",
      "Inspect what happens when the training set only includes blue fish, then re-train with diverse shapes and colors."
    ],
    "teacherQuestions": [
      "Why did the AI accidentally classify a starfish or sea turtle as 'not belong in the ocean' during the first round?",
      "Who is responsible when an AI makes a biased prediction\u2014the computer or the humans who selected the training data?",
      "How can we use AI classification to help solve real environmental problems in our local community?"
    ],
    "offlineClassroomAlternative": "Unplugged 'Ocean Sorting AI': Spread 20 picture cards of sea creatures and plastic waste on a table. Give one student a biased rule card ('Only things with fins belong in the sea') and have the class audit which sea animals get unfairly rejected.",
    "licenseAndPrivacy": "License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0. Privacy Audit: Hour of Code / Hour of AI tutorials run without student accounts or sign-in requirements."
  }
];
