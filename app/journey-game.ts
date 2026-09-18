export const journeySteps = [
  {
    title: "Discover", subtitle: "Write Your Idea", agent: "Chitti", color: "#007e99", position: [-4, -3.8],
    description: "Define the problem and your goals.",
    question: "Every great product starts with…",
    options: ["A long list of features", "A real problem worth solving", "A finished logo"], answer: 1,
    hint: "Start with why your product should exist. What could it make better?",
    reward: "Idea discovered! A clear problem gives your product a purpose.",
  },
  {
    title: "Define Users", subtitle: "Focus on Users", agent: "Mira", color: "#0757dd", position: [0, -3.8],
    description: "Understand user needs, behaviours, and success criteria.",
    question: "Who helps you understand what people really need?",
    options: ["Only your competitors", "Your own assumptions", "The people who will use it"], answer: 2,
    hint: "Listen to real users and learn about their day-to-day problems.",
    reward: "Users understood! Their needs become your guide for every decision.",
  },
  {
    title: "Strategize", subtitle: "Shape the Scope", agent: "Veda", color: "#7024d9", position: [4, -3.8],
    description: "Use user research and business goals to shape your product direction.",
    question: "What should guide your product strategy?",
    options: ["User needs and business goals", "The longest possible feature list", "Competitors’ features alone"], answer: 0,
    hint: "Connect what you learned from users with the outcomes your business needs.",
    reward: "Direction set! User needs and business goals give your team a shared focus.",
  },
  {
    title: "Prioritize", subtitle: "Set What Matters", agent: "Prion", color: "#9d20cc", position: [4, 0],
    description: "Focus on high-impact features and deliver maximum value.",
    question: "Which feature belongs in your first release?",
    options: ["The flashiest animation", "The one that solves the core need", "Whatever takes the longest"], answer: 1,
    hint: "Choose the work that makes the biggest difference to your users.",
    reward: "Priorities clear! Value comes from solving the right problem first.",
  },
  {
    title: "Plan", subtitle: "Assign the Work", agent: "Timo", color: "#c11579", position: [0, 0],
    description: "Turn agreed priorities into tasks, owners, and realistic timelines.",
    question: "Your priorities are clear. What turns them into a delivery plan?",
    options: ["Clear tasks, owners, and milestones", "Everyone doing everything", "A deadline with no plan"], answer: 0,
    hint: "Plan the prioritized work, including who owns each task and when it is needed.",
    reward: "Team aligned! Your priorities now have owners, tasks, and milestones.",
  },
  {
    title: "Design", subtitle: "Design the Experience", agent: "Kavi", color: "#cf394b", position: [-4, 0],
    description: "Create intuitive and meaningful experiences for your users.",
    question: "What makes an experience feel effortless?",
    options: ["More buttons on every screen", "Hiding the important actions", "A clear, accessible path to the goal"], answer: 2,
    hint: "Good design helps people get things done with confidence.",
    reward: "Experience shaped! Every interaction now has a clear purpose.",
  },
  {
    title: "Build", subtitle: "Build Together", agent: "Bito", color: "#007f99", position: [-4, 3.8],
    description: "Bring design to life with clean, scalable and reliable code.",
    question: "What is a reliable way to build together?",
    options: ["Small increments with regular reviews", "One giant, unreviewed release", "Wait until the end to collaborate"], answer: 0,
    hint: "Frequent collaboration catches problems while they are still small.",
    reward: "Product built! Small, reviewed steps add up to something great.",
  },
  {
    title: "Test", subtitle: "Test Every Detail", agent: "Tessa", color: "#076cdd", position: [0, 3.8],
    description: "Check quality, speed and reliability.",
    question: "Before launch, what should you check?",
    options: ["Only that the homepage loads", "Real journeys, accessibility, and speed", "Nothing — it worked once"], answer: 1,
    hint: "Test the experience people will actually have, across devices and needs.",
    reward: "Ready for takeoff! Testing gives you and your users confidence.",
  },
  {
    title: "Launch", subtitle: "Launch and Learn", agent: "Nova", color: "#a96300", position: [4, 3.8],
    description: "Release, gather feedback and improve.",
    question: "Your product is live. What comes next?",
    options: ["Never change it again", "Stop talking to users", "Listen, learn, and keep improving"], answer: 2,
    hint: "Launch is the beginning of learning from real-world use.",
    reward: "All nine sparks collected. Your idea is ready to meet the world!",
  },
] as const;

export type JourneyState = { started: boolean; active: number; completed: number; answer: number | null; launched: boolean };
export type JourneyAction = { type: "start" | "next" | "launch" | "reset" } | { type: "select" | "answer"; index: number };
export const initialJourney: JourneyState = { started: false, active: 0, completed: 0, answer: null, launched: false };

export function getJourneyAgentStatus(state: JourneyState, index: number): "ready" | "active" | "complete" {
  if (index < state.completed) return "complete";
  if (state.started && !state.launched && state.active === index) return "active";
  return "ready";
}

export function journeyReducer(state: JourneyState, action: JourneyAction): JourneyState {
  switch (action.type) {
    case "reset": return initialJourney;
    case "start": return { ...state, started: true };
    case "select":
      if (state.launched || !Number.isInteger(action.index) || action.index < 0 || action.index >= journeySteps.length || action.index > state.completed) return state;
      return { ...state, started: true, active: action.index, answer: null };
    case "answer":
      if (!state.started || state.launched || state.active < state.completed || !Number.isInteger(action.index) || action.index < 0 || action.index > 2) return state;
      return { ...state, answer: action.index, completed: state.completed + Number(action.index === journeySteps[state.active].answer) };
    case "next":
      if (!state.started || state.launched || state.active >= state.completed) return state;
      return { ...state, active: Math.min(state.completed, journeySteps.length - 1), answer: null };
    case "launch":
      return state.completed === journeySteps.length ? { ...state, launched: true } : state;
  }
}
