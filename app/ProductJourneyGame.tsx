"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import Link from "./i18n/LocalizedLink";
import { useLocale } from "./i18n/LocaleProvider";
import { journeySteps } from "./journey-game";
import { useJourney } from "./JourneyProvider";
import JourneyAgent from "./JourneyAgent";
import type { JourneyScene } from "./journey-scene";
import styles from "./ProductJourneyGame.module.css";

export default function ProductJourneyGame() {
  const { t } = useLocale();
  const { state, dispatch } = useJourney();
  const [renderMode, setRenderMode] = useState<"loading" | "3d" | "fallback">("loading");
  const [paused, setPaused] = useState(false);
  const map = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const labels = useRef<(HTMLButtonElement | null)[]>([]);
  const scene = useRef<JourneyScene | null>(null);
  const latest = useRef(state);
  const latestPaused = useRef(paused);
  const mission = useRef<HTMLHeadingElement>(null);
  const step = journeySteps[state.active];
  const solved = state.active < state.completed;

  useEffect(() => {
    latest.current = state;
    scene.current?.update(state);
  }, [state]);

  useEffect(() => { latestPaused.current = paused; scene.current?.setPaused(paused); }, [paused]);

  useEffect(() => {
    const checkpoint = labels.current[state.active];
    const track = checkpoint?.closest("ol");
    if (!state.started || !checkpoint || !track || track.scrollWidth <= track.clientWidth) return;
    const item = checkpoint.getBoundingClientRect();
    const visible = track.getBoundingClientRect();
    track.scrollBy({ left: item.left - visible.left - (visible.width - item.width) / 2 });
  }, [state.active, state.started]);

  useEffect(() => {
    const host = map.current;
    const surface = canvas.current;
    if (!host || !surface) return;
    let cancelled = false;
    let initialized = false;
    const observer = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting || initialized) return;
      initialized = true;
      observer.disconnect();
      try {
        const { createJourneyScene } = await import("./journey-scene");
        if (cancelled) return;
        scene.current = createJourneyScene(surface, host, labels.current, (index) => dispatch({ type: "select", index }), () => setRenderMode("fallback"));
        scene.current.update(latest.current);
        scene.current.setPaused(latestPaused.current);
        setRenderMode("3d");
      } catch {
        if (!cancelled) setRenderMode("fallback");
      }
    }, { rootMargin: "200px" });
    observer.observe(host);
    return () => { cancelled = true; observer.disconnect(); scene.current?.dispose(); scene.current = null; };
  }, [dispatch]);

  const focusMission = () => requestAnimationFrame(() => {
    mission.current?.closest("aside")?.scrollTo({ top: 0 });
    mission.current?.focus({ preventScroll: true });
  });
  const selectCheckpoint = (index: number) => { dispatch({ type: "select", index }); focusMission(); };
  const next = () => { dispatch({ type: "next" }); focusMission(); };
  const keyboard = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.repeat) return;
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
      event.preventDefault();
      dispatch({ type: "select", index: state.active + (event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1) });
    } else if (["1", "2", "3"].includes(event.key) && state.started) {
      event.preventDefault();
      dispatch({ type: "answer", index: Number(event.key) - 1 });
    }
  };

  return (
    <section className={styles.journey} id="spark-to-launch" data-pitch-section aria-labelledby="game-title">
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow}><span />{t("A BIG IDEA. NINE SMALL STEPS.")}</p>
          <a className={styles.mapLink} href="#journey">{t("Product Journey map")} <span aria-hidden="true">↗</span></a>
        </header>
        <div className={styles.game} onKeyDown={keyboard} role="group" aria-label={t("Spark to Launch game")}>
          <div className={styles.toolbar}>
            <div className={styles.gameName}><span className={styles.gameIcon} aria-hidden="true">✦</span><h2 id="game-title">{t("Spark to Launch")}</h2><span className={styles.gameEdition}>{t("THE IDEA-TO-LAUNCH GAME")}</span></div>
            <div className={styles.gameTools}>
              <span className={styles.sparkCount} aria-label={`${state.completed} / 9 ${t("sparks collected")}`}><span aria-hidden="true">✦</span> {state.completed}<small>/ 9</small></span>
              <button type="button" className={styles.toolButton} onClick={() => setPaused(!paused)} aria-pressed={paused} aria-label={t(paused ? "Resume animation" : "Pause animation")} title={t(paused ? "Resume animation" : "Pause animation")}>{paused ? "▷" : "Ⅱ"}</button>
              <button type="button" className={styles.toolButton} onClick={() => { dispatch({ type: "reset" }); focusMission(); }} aria-label={t("Restart journey")} title={t("Restart journey")}>↺</button>
            </div>
          </div>
          <div className={styles.playArea}>
            <div className={styles.map} ref={map} data-render-mode={renderMode} data-launched={state.launched}>
              <div className={styles.mapCaption}><span className={styles.liveDot} />{t(state.launched ? "MISSION ACCOMPLISHED" : "A BIG IDEA. NINE SMALL STEPS.")}</div>
              <canvas ref={canvas} className={styles.canvas} aria-hidden="true" />
              <div className={styles.fallbackTrack} aria-hidden="true" />
              <ol className={styles.checkpoints} aria-label={t("Journey checkpoints")}>
                {journeySteps.map((item, index) => (
                  <li key={item.title}>
                    <button
                      type="button" ref={(element) => { labels.current[index] = element; }}
                      className={styles.checkpoint} data-active={state.active === index} data-complete={index < state.completed}
                      disabled={index > state.completed || state.launched}
                      aria-current={state.active === index ? "step" : undefined}
                      aria-label={`${index + 1}. ${t(item.title)}${index < state.completed ? ` — ${t("Completed")}` : ""}`}
                      onClick={() => selectCheckpoint(index)}
                      style={{ "--checkpoint-color": item.color, "--fallback-x": `${50 + item.position[0] * 7}%`, "--fallback-y": `${50 + item.position[1] * 7.7}%` } as CSSProperties}
                    ><span>{index < state.completed ? "✓" : String(index + 1).padStart(2, "0")}</span>{t(item.title)}</button>
                  </li>
                ))}
              </ol>
              {state.launched && <div className={styles.launchBanner}><span aria-hidden="true">✦</span>{t("Hi, There!")}<small>{t("Your next big thing starts here.")}</small></div>}
              <p className={styles.mapHint}>{renderMode === "fallback" ? t("Your journey is ready in simple view.") : t("Follow the path. Find your spark.")}</p>
            </div>
            <aside className={styles.mission} style={{ "--mission-color": step.color } as CSSProperties} aria-label={t("Current mission")} tabIndex={0}>
              {!state.started ? <>
                <p className={styles.missionEyebrow}><span />{t("PLAYER ONE: YOU")}</p>
                <div className={styles.welcomeArt} aria-hidden="true"><span>✦</span><i>✧</i><b>↗</b></div>
                <h3 ref={mission} tabIndex={-1}>{t("Big ideas start with a little spark.")}</h3>
                <p className={styles.missionDescription}>{t("Take your idea on an adventure. Make a choice at each checkpoint, collect nine sparks, and get ready for liftoff.")}</p>
                <div className={styles.questFacts}><span>9 {t("checkpoints")}</span><span>~2 {t("minutes")}</span><span>{t("Your next big idea")}</span></div>
                <button type="button" className={styles.primary} onClick={() => { dispatch({ type: "start" }); focusMission(); }}>{t("Let’s play")}<span aria-hidden="true">↗</span></button>
                <p className={styles.noPressure}>{t("No timer. Just curiosity.")}</p>
              </> : state.launched ? <>
                <p className={styles.missionEyebrow}><span />{t("ALL SYSTEMS GO")}</p>
                <div className={styles.trophy} aria-hidden="true">✦</div>
                <h3 ref={mission} tabIndex={-1}>{t("From a spark to something real.")}</h3>
                <p className={styles.missionDescription}>{t("You navigated all nine stages. Now let’s turn your own idea into a product people love.")}</p>
                <div className={styles.finishScore}>9 / 9 <span>{t("sparks collected")}</span></div>
                <Link className={styles.primary} href="https://www.software-system.design">{t("Build my idea")}<span aria-hidden="true">↗</span></Link>
                <button type="button" className={styles.textButton} onClick={() => { dispatch({ type: "reset" }); focusMission(); }}>{t("Play again")} ↺</button>
              </> : <>
                <div className={styles.missionTop}><p className={styles.missionEyebrow}>{t("CHECKPOINT")} {String(state.active + 1).padStart(2, "0")}<span className={styles.ofNine}>/ 09</span></p><span className={styles.rewardChip}>✦ +1</span></div>
                <div className={styles.missionAgent} role="status" aria-live="polite"><JourneyAgent index={state.active} /></div>
                <h3 ref={mission} tabIndex={-1}>{t(step.title)}</h3>
                <p className={styles.missionSubtitle}>{t(step.subtitle)}</p>
                <p className={styles.missionDescription}>{t(step.description)}</p>
                <div className={styles.challenge}>
                  <p>{t(step.question)}</p>
                  <div className={styles.options}>
                    {step.options.map((option, index) => <button type="button" key={option} onClick={() => dispatch({ type: "answer", index })} disabled={solved} data-correct={solved && index === step.answer} data-wrong={!solved && state.answer === index} aria-pressed={state.answer === index || (solved && index === step.answer)}><span aria-hidden="true">{solved && index === step.answer ? "✓" : index + 1}</span>{t(option)}</button>)}
                  </div>
                </div>
                <div className={styles.feedback} data-success={solved} role="status" aria-live="polite">
                  {solved ? <p><strong>{t("Spark collected!")}</strong> {t(step.reward)}</p> : state.answer !== null ? <p>{t(step.hint)}</p> : <p>{t("Choose your next move.")}</p>}
                </div>
                {solved && <button type="button" className={styles.primary} onClick={state.completed === 9 ? () => { dispatch({ type: "launch" }); focusMission(); } : next}>{t(state.completed === 9 ? "Launch my idea" : "Next checkpoint")}<span aria-hidden="true">{state.completed === 9 ? "↗" : "→"}</span></button>}
              </>}
            </aside>
          </div>
          <div className={styles.gameFooter}>
            <div className={styles.progressGroup}><span>{t("YOUR JOURNEY")}</span><div className={styles.progress} role="progressbar" aria-label={t("Journey progress")} aria-valuemin={0} aria-valuemax={9} aria-valuenow={state.completed}>{journeySteps.map((item, index) => <i key={item.title} data-filled={index < state.completed} style={{ "--checkpoint-color": item.color } as CSSProperties} />)}</div><strong>{Math.round(state.completed / 9 * 100)}%</strong></div>
            <p className={styles.controlsHint}>{t("Click or tap to play")}<span> · {t("Keys 1–3 to choose")}</span></p>
          </div>
        </div>
      </div>
    </section>
  );
}
