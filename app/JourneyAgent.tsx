"use client";

import type { CSSProperties } from "react";
import { getJourneyAgentStatus, journeySteps } from "./journey-game";
import { useJourney } from "./JourneyProvider";
import { useLocale } from "./i18n/LocaleProvider";
import styles from "./JourneyAgent.module.css";

function AgentAvatar({ name }: { name: (typeof journeySteps)[number]["agent"] }) {
  return <svg className={styles.avatar} viewBox="0 0 64 64" fill="none" aria-hidden="true" focusable="false">
    <circle cx="32" cy="32" r="31" fill="currentColor" opacity=".12" />
    <path d="M13 62v-5c0-9 8-14 19-14s19 5 19 14v5" fill="currentColor" />
    <path d="m26 48 6 7 6-7" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <rect x="11" y="27" width="7" height="13" rx="3" fill="currentColor" />
    <rect x="46" y="27" width="7" height="13" rx="3" fill="currentColor" />
    <rect x="16" y="18" width="32" height="31" rx={name === "Bito" ? 7 : name === "Nova" ? 16 : 12} fill="white" stroke="currentColor" strokeWidth="2" />
    <rect x="20" y="26" width="24" height="14" rx={name === "Prion" ? 4 : 7} fill="#192345" />
    {name === "Tessa" ? <path d="m24 33 3 3 5-6m3 3h4" stroke="#a5f3fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      : name === "Mira" ? <path d="M24 34q3-5 6 0m4 0q3-5 6 0" stroke="#a5f3fc" strokeWidth="2" strokeLinecap="round" />
      : <><rect x="25" y="30" width="4" height={name === "Bito" ? 4 : 6} rx={name === "Bito" ? 0 : 2} fill="#a5f3fc" /><rect x="35" y="30" width="4" height="6" rx="2" fill="#a5f3fc" /></>}
    <path d="M28 43q4 3 8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    {name === "Chitti" && <><path d="M32 18v-6m-7-2 7-5 7 5-7 5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /><circle cx="46" cy="22" r="4" fill="#ffc857" /></>}
    {name === "Mira" && <><path d="M11 29v-4a21 21 0 0 1 42 0v4" stroke="currentColor" strokeWidth="3" /><path d="M51 38v5h-8" stroke="currentColor" strokeWidth="2" /><circle cx="42" cy="43" r="2" fill="currentColor" /></>}
    {name === "Veda" && <><path d="m14 19 18-10 18 10-18 6Z" fill="currentColor" /><path d="M48 20v9" stroke="currentColor" strokeWidth="2" /><circle cx="48" cy="30" r="3" fill="#ffc857" /></>}
    {name === "Prion" && <><path d="m20 21-2-11 9 5 5-9 5 9 9-5-2 11Z" fill="currentColor" /><path d="m32 12 3 5-3 4-3-4Z" fill="#ffc857" /></>}
    {name === "Timo" && <><path d="M24 18v-7m16 7v-7M21 9h6m10 0h6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /><circle cx="48" cy="45" r="8" fill="white" stroke="currentColor" strokeWidth="2" /><path d="M48 40v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>}
    {name === "Kavi" && <><path d="M13 22c0-14 36-17 38-2-10-3-24 7-38 2Z" fill="currentColor" /><path d="m33 11 5-6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /><circle cx="46" cy="44" r="4" fill="#ffc857" /><circle cx="18" cy="44" r="3" fill="#ffc857" /></>}
    {name === "Bito" && <><path d="M13 24c0-10 8-17 19-17s19 7 19 17Z" fill="currentColor" /><path d="M29 8v12m6-12v12M12 24h40" stroke="#a5f3fc" strokeWidth="3" strokeLinecap="round" /></>}
    {name === "Tessa" && <><circle cx="23" cy="20" r="7" fill="currentColor" /><circle cx="41" cy="20" r="7" fill="currentColor" /><circle cx="23" cy="20" r="4" fill="#a5f3fc" /><circle cx="41" cy="20" r="4" fill="#a5f3fc" /><path d="M29 20h6" stroke="currentColor" strokeWidth="3" /></>}
    {name === "Nova" && <><path d="m17 25-5-12 12 7m23 5 5-12-12 7" fill="currentColor" /><path d="m32 7 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="#ffc857" /><path d="M17 43q15 17 30 0" stroke="currentColor" strokeWidth="3" /></>}
  </svg>;
}

export default function JourneyAgent({ index }: { index: number }) {
  const { state } = useJourney();
  const { t } = useLocale();
  const step = journeySteps[index];
  const status = getJourneyAgentStatus(state, index);
  const label = t(status === "active" ? "In progress" : status === "complete" ? "Completed" : "Ready");

  return <div className={styles.agent} data-agent={step.agent} data-agent-status={status}
    style={{ "--agent-color": step.color } as CSSProperties}
    title={`${step.agent} · ${t(step.title)}: ${t(step.description)}`}>
    <AgentAvatar name={step.agent} />
    <div className={styles.identity}>
      <span className={styles.name}>{step.agent}<span className={styles.ai}>AI</span></span>
      <span className={styles.status}><i aria-hidden="true" />{label}</span>
    </div>
  </div>;
}
