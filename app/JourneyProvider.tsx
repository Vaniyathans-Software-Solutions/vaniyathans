"use client";

import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from "react";
import { initialJourney, journeyReducer, type JourneyAction, type JourneyState } from "./journey-game";

const JourneyContext = createContext<{ state: JourneyState; dispatch: Dispatch<JourneyAction> } | null>(null);

export default function JourneyProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(journeyReducer, initialJourney);
  return <JourneyContext.Provider value={{ state, dispatch }}>{children}</JourneyContext.Provider>;
}

export function useJourney() {
  const journey = useContext(JourneyContext);
  if (!journey) throw new Error("Journey components must be inside JourneyProvider");
  return journey;
}
