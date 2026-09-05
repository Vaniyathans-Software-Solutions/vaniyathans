"use client";

import Link from "next/link";
import Image from "next/image";
import { FormEvent, Fragment, useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

type StudioView = "kanban" | "backlog" | "analytics";
type WorkType = "Epic" | "Feature" | "Story" | "Task" | "Subtask";
type WorkStatus = "backlog" | "ready" | "progress" | "review" | "done";
type Priority = "Critical" | "High" | "Medium" | "Low";

type WorkItem = {
  id: string;
  type: WorkType;
  title: string;
  parentId: string | null;
  status: WorkStatus;
  priority: Priority;
  assignee: string;
  points: number;
};

type Profile = {
  accountType?: "client" | "workforce";
  fullName?: string;
  email?: string;
  company?: string;
  projectName?: string;
  epic?: string;
  timeline?: string;
  primaryRole?: string;
};

const noopSubscribe = () => () => {};

const statuses: Array<{ key: WorkStatus; label: string; tone: string }> = [
  { key: "backlog", label: "Backlog", tone: "slate" },
  { key: "ready", label: "Ready", tone: "violet" },
  { key: "progress", label: "In progress", tone: "blue" },
  { key: "review", label: "Diagnose", tone: "amber" },
  { key: "done", label: "Done", tone: "green" },
];

const nextType: Partial<Record<WorkType, WorkType>> = {
  Epic: "Feature",
  Feature: "Story",
  Story: "Task",
  Task: "Subtask",
};

const typeGlyph: Record<WorkType, string> = { Epic: "◆", Feature: "▦", Story: "●", Task: "✓", Subtask: "·" };
const assigneeInitials: Record<string, string> = { AK: "AK", MS: "MS", RV: "RV", NJ: "NJ", PS: "PS", UI: "UI" };

const initialItems: WorkItem[] = [
  { id: "VSS-1", type: "Epic", title: "Launch the self-serve client workspace", parentId: null, status: "progress", priority: "Critical", assignee: "AK", points: 34 },
  { id: "VSS-2", type: "Feature", title: "Frictionless client onboarding", parentId: "VSS-1", status: "progress", priority: "High", assignee: "MS", points: 13 },
  { id: "VSS-3", type: "Story", title: "Create a guided project brief", parentId: "VSS-2", status: "done", priority: "High", assignee: "UI", points: 5 },
  { id: "VSS-4", type: "Task", title: "Build multi-step intake form", parentId: "VSS-3", status: "done", priority: "High", assignee: "RV", points: 3 },
  { id: "VSS-5", type: "Subtask", title: "Validate company and contact details", parentId: "VSS-4", status: "done", priority: "Medium", assignee: "RV", points: 1 },
  { id: "VSS-6", type: "Story", title: "Invite stakeholders to the workspace", parentId: "VSS-2", status: "review", priority: "Medium", assignee: "NJ", points: 5 },
  { id: "VSS-7", type: "Task", title: "Create invitation and role controls", parentId: "VSS-6", status: "review", priority: "Medium", assignee: "NJ", points: 3 },
  { id: "VSS-8", type: "Feature", title: "Live delivery visibility", parentId: "VSS-1", status: "progress", priority: "Critical", assignee: "AK", points: 21 },
  { id: "VSS-9", type: "Story", title: "See work moving on a Kanban board", parentId: "VSS-8", status: "progress", priority: "High", assignee: "MS", points: 8 },
  { id: "VSS-10", type: "Task", title: "Create status columns and work cards", parentId: "VSS-9", status: "progress", priority: "High", assignee: "PS", points: 5 },
  { id: "VSS-11", type: "Subtask", title: "Add quick status controls", parentId: "VSS-10", status: "ready", priority: "Medium", assignee: "PS", points: 2 },
  { id: "VSS-12", type: "Story", title: "Explore the hierarchical backlog", parentId: "VSS-8", status: "ready", priority: "High", assignee: "RV", points: 8 },
  { id: "VSS-13", type: "Task", title: "Render Epic-to-Subtask relationships", parentId: "VSS-12", status: "ready", priority: "High", assignee: "RV", points: 5 },
  { id: "VSS-14", type: "Feature", title: "Delivery analytics", parentId: "VSS-1", status: "backlog", priority: "Medium", assignee: "NJ", points: 13 },
  { id: "VSS-15", type: "Story", title: "Track completion and throughput", parentId: "VSS-14", status: "backlog", priority: "Medium", assignee: "NJ", points: 5 },
  { id: "VSS-16", type: "Task", title: "Build project health indicators", parentId: "VSS-15", status: "backlog", priority: "Low", assignee: "UI", points: 3 },
];

export default function WorkspacePage() {
  const router = useRouter();
  const profileRaw = useSyncExternalStore(noopSubscribe, () => localStorage.getItem("vss_profile") ?? "", () => "");
  const sessionRaw = useSyncExternalStore(noopSubscribe, () => localStorage.getItem("vss_session") ?? "", () => "");
  const profile = useMemo<Profile>(() => {
    try { return profileRaw ? JSON.parse(profileRaw) as Profile : {}; } catch { return {}; }
  }, [profileRaw]);
  const session = useMemo<{ name?: string; email?: string; accountType?: "client" | "workforce" }>(() => {
    try { return sessionRaw ? JSON.parse(sessionRaw) as { name?: string; email?: string; accountType?: "client" | "workforce" } : {}; } catch { return {}; }
  }, [sessionRaw]);

  const [view, setView] = useState<StudioView>("kanban");
  const [items, setItems] = useState<WorkItem[]>(initialItems);
  const [query, setQuery] = useState("");
  const [composer, setComposer] = useState<{ parent: WorkItem | null; type: WorkType } | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<Priority>("Medium");
  const [newAssignee, setNewAssignee] = useState("AK");
  const [newPoints, setNewPoints] = useState(3);

  const projectItems = useMemo(() => items.map((item) => item.id === "VSS-1" && profile.epic ? { ...item, title: profile.epic } : item), [items, profile.epic]);
  const visibleItems = useMemo(() => projectItems.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()) || item.id.toLowerCase().includes(query.toLowerCase())), [projectItems, query]);
  const totalPoints = projectItems.reduce((sum, item) => sum + item.points, 0);
  const donePoints = projectItems.filter((item) => item.status === "done").reduce((sum, item) => sum + item.points, 0);
  const progress = Math.round((donePoints / totalPoints) * 100);
  const firstName = (profile.fullName || session.name || "Alex").split(" ")[0];
  const accountType = session.accountType ?? profile.accountType ?? "client";
  const isWorkforce = accountType === "workforce";
  const projectName = profile.projectName || (isWorkforce ? "Vaniyathans Delivery Hub" : "Momentum Client Portal");
  const accountLabel = isWorkforce ? (profile.primaryRole || "Workforce member").toUpperCase() : "CLIENT OWNER";

  const moveItem = (id: string, direction: -1 | 1) => {
    setItems((current) => current.map((item) => {
      if (item.id !== id) return item;
      const index = statuses.findIndex((status) => status.key === item.status);
      return { ...item, status: statuses[Math.max(0, Math.min(statuses.length - 1, index + direction))].key };
    }));
  };

  const startBreakdown = (item: WorkItem) => {
    const child = nextType[item.type];
    if (child) {
      setComposer({ parent: item, type: child });
      setNewTitle("");
    }
  };

  const createItem = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!composer || !newTitle.trim()) return;
    const largestId = Math.max(...items.map((item) => Number(item.id.split("-")[1])));
    setItems((current) => [...current, {
      id: `VSS-${largestId + 1}`,
      type: composer.type,
      title: newTitle.trim(),
      parentId: composer.parent?.id ?? null,
      status: "backlog",
      priority: newPriority,
      assignee: newAssignee,
      points: newPoints,
    }]);
    setComposer(null);
  };

  const renderBacklog = (parentId: string | null, depth = 0): React.ReactNode => visibleItems.filter((item) => item.parentId === parentId).map((item) => {
    const children = projectItems.filter((candidate) => candidate.parentId === item.id).length;
    const childType = nextType[item.type];
    return (
      <Fragment key={item.id}>
        <div className="backlogRow" style={{ "--tree-depth": depth } as React.CSSProperties}>
          <div className="backlogIdentity"><span className={`itemType type${item.type}`}>{typeGlyph[item.type]}</span><div><strong>{item.title}</strong><small>{item.id} · {item.type}{children ? ` · ${children} child item${children > 1 ? "s" : ""}` : ""}</small></div></div>
          <span className={`priority priority${item.priority}`}>{item.priority}</span>
          <span className="pointsPill">{item.points} pts</span>
          <span className="assigneeAvatar" title={`Assigned to ${item.assignee}`}>{assigneeInitials[item.assignee] ?? item.assignee}</span>
          <span className={`statusPill status${item.status}`}>{statuses.find((status) => status.key === item.status)?.label}</span>
          {childType ? <button className="breakdownButton" onClick={() => startBreakdown(item)}>+ {childType}</button> : <span className="leafLabel">LEAF</span>}
        </div>
        {renderBacklog(item.id, depth + 1)}
      </Fragment>
    );
  });

  const signOut = () => {
    localStorage.removeItem("vss_session");
    router.push("/signin");
  };

  return (
    <main className="workspaceApp">
      <aside className="studioSidebar">
        <Link className="studioBrand" href="/" aria-label="Vaniyathans home"><span aria-hidden="true">V</span><Image src="/vaniyathans-logo-2026.png" alt="Vaniyathans Software Solutions" width={1984} height={793} /></Link>
        <nav className="studioNav" aria-label="Workspace views">
          <button className={view === "kanban" ? "isActive" : ""} onClick={() => setView("kanban")}><i>▦</i><span>Kanban</span></button>
          <button className={view === "backlog" ? "isActive" : ""} onClick={() => setView("backlog")}><i>≡</i><span>Backlog</span></button>
          <button className={view === "analytics" ? "isActive" : ""} onClick={() => setView("analytics")}><i>◒</i><span>Analytics</span></button>
        </nav>
        <div className="workforcePanel">
          <div className="workforceTitle"><span /><strong>Workforce live</strong></div>
          <div className="workforceAvatars"><i>AK</i><i>MS</i><i>RV</i><i>NJ</i><b>+8</b></div>
          <p>12 engineers active across 4 time zones.</p>
        </div>
        <button className="studioSignout" onClick={signOut}>↙ <span>Sign out</span></button>
      </aside>

      <section className="studioMain">
        <header className="studioTopbar">
          <div className="projectSwitcher"><span className="projectMark">{projectName.slice(0, 2).toUpperCase()}</span><div><small>ACTIVE PROJECT</small><strong>{projectName}</strong></div><i>⌄</i></div>
          <div className="studioTopActions"><label className="studioSearch"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search work items" aria-label="Search work items" /></label><button className="notificationButton" aria-label="Notifications">♢<span>3</span></button><div className="profileChip"><span>{firstName.slice(0, 2).toUpperCase()}</span><div><strong>{firstName}</strong><small>{accountLabel}</small></div></div></div>
        </header>

        <div className="studioContent">
          <div className="studioHero">
            <div><p className="studioEyebrow">{isWorkforce ? "WORKFORCE STUDIO" : "CLIENT STUDIO"} / {view.toUpperCase()}</p><h1>{view === "kanban" ? "Delivery in motion." : view === "backlog" ? "Work, clearly structured." : "Progress, made visible."}</h1><p>{view === "kanban" ? "Move work from backlog to deployment across your always-on engineering team." : view === "backlog" ? "Break every epic down into features, stories, tasks, and actionable subtasks." : "Understand delivery health, throughput, and where the team is focusing next."}</p></div>
            <div className="studioHeroActions"><button className="secondaryStudioButton" onClick={() => setView("backlog")}>View hierarchy</button><button className="primaryStudioButton" onClick={() => { setComposer({ parent: null, type: "Epic" }); setNewTitle(""); }}>+ New Epic</button></div>
          </div>

          <div className="deliveryStrip">
            <div><span>SPRINT 08</span><strong>Global client workspace</strong></div>
            <div><span>DELIVERY HEALTH</span><strong className="healthGood"><i /> On track</strong></div>
            <div><span>SPRINT PROGRESS</span><strong>{progress}% complete</strong></div>
            <div className="stripProgress"><span style={{ width: `${progress}%` }} /></div>
            <div><span>NEXT RELEASE</span><strong>Today · 18:30 IST</strong></div>
          </div>

          {view === "kanban" && (
            <section className="kanbanBoard" aria-label="Project Kanban board">
              {statuses.map((status) => {
                const columnItems = visibleItems.filter((item) => item.status === status.key);
                return <div className={`kanbanColumn tone${status.tone}`} key={status.key}>
                  <div className="kanbanColumnHeader"><div><i /><strong>{status.label}</strong><span>{columnItems.length}</span></div><button aria-label={`Add item to ${status.label}`} onClick={() => { setComposer({ parent: null, type: "Epic" }); setNewTitle(""); }}>+</button></div>
                  <div className="kanbanCards">
                    {columnItems.map((item) => <article className="workCard" key={item.id}>
                      <div className="workCardMeta"><span className={`itemType type${item.type}`}>{typeGlyph[item.type]} {item.type}</span><button aria-label={`More options for ${item.title}`}>•••</button></div>
                      <h2>{item.title}</h2>
                      <p>{item.id} · {item.points} story points</p>
                      <div className="workCardFooter"><span className={`priority priority${item.priority}`}>{item.priority}</span><div className="cardControls"><button disabled={status.key === "backlog"} onClick={() => moveItem(item.id, -1)} aria-label={`Move ${item.title} backward`}>←</button><span className="assigneeAvatar">{item.assignee}</span><button disabled={status.key === "done"} onClick={() => moveItem(item.id, 1)} aria-label={`Move ${item.title} forward`}>→</button></div></div>
                    </article>)}
                    {!columnItems.length && <div className="emptyColumn">No matching work</div>}
                  </div>
                </div>;
              })}
            </section>
          )}

          {view === "backlog" && (
            <section className="backlogPanel" aria-label="Hierarchical project backlog">
              <div className="hierarchyLegend"><span>◆ EPIC</span><i>→</i><span>▦ FEATURE</span><i>→</i><span>● STORY</span><i>→</i><span>✓ TASK</span><i>→</i><span>· SUBTASK</span></div>
              <div className="backlogHeader"><span>WORK ITEM</span><span>PRIORITY</span><span>ESTIMATE</span><span>OWNER</span><span>STATUS</span><span>ACTION</span></div>
              <div className="backlogRows">{renderBacklog(null)}</div>
            </section>
          )}

          {view === "analytics" && (
            <section className="analyticsPanel" aria-label="Delivery analytics">
              <div className="metricGrid">
                <article><span>OVERALL PROGRESS</span><div className="progressRing" style={{ "--progress": `${progress * 3.6}deg` } as React.CSSProperties}><strong>{progress}%</strong><small>COMPLETE</small></div><p>{donePoints} of {totalPoints} story points delivered</p></article>
                <article><span>SPRINT VELOCITY</span><strong className="largeMetric">38<small>PTS</small></strong><div className="miniBars">{[36, 52, 46, 68, 58, 82, 74].map((height, index) => <i style={{ height: `${height}%` }} key={index} />)}</div><p><b>↑ 12%</b> from the last sprint</p></article>
                <article><span>CYCLE TIME</span><strong className="largeMetric">6.4<small>HRS</small></strong><div className="cycleLine"><i /><i /><i /><i /><i /></div><p>Target stays below the 8-hour delivery window</p></article>
                <article><span>ACTIVE WORKFORCE</span><strong className="largeMetric">12<small>LIVE</small></strong><div className="timezoneRows"><div><i /> INDIA <b>6</b></div><div><i /> EUROPE <b>3</b></div><div><i /> AMERICAS <b>3</b></div></div></article>
              </div>
              <div className="analyticsLower">
                <article className="statusAnalytics"><div className="analyticsTitle"><div><span>FLOW DISTRIBUTION</span><h2>Work by status</h2></div><small>{projectItems.length} total items</small></div>{statuses.map((status) => { const count = projectItems.filter((item) => item.status === status.key).length; return <div className="statusBar" key={status.key}><span>{status.label}</span><div><i className={`bar${status.tone}`} style={{ width: `${(count / projectItems.length) * 100}%` }} /></div><strong>{count}</strong></div>; })}</article>
                <article className="activityFeed"><div className="analyticsTitle"><div><span>LIVE ACTIVITY</span><h2>Across the globe</h2></div><i className="liveIndicator" /></div><ul><li><span>RV</span><div><strong>Moved VSS-4 to Done</strong><small>Trivandrum · 4 min ago</small></div></li><li><span>MS</span><div><strong>Added acceptance criteria</strong><small>London · 12 min ago</small></div></li><li><span>NJ</span><div><strong>Started diagnosis on VSS-7</strong><small>Toronto · 19 min ago</small></div></li><li><span>AK</span><div><strong>Prioritized Sprint 08</strong><small>Dubai · 31 min ago</small></div></li></ul></article>
              </div>
            </section>
          )}
        </div>
      </section>

      {composer && (
        <div className="composerBackdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setComposer(null); }}>
          <form className="itemComposer" onSubmit={createItem} role="dialog" aria-modal="true" aria-labelledby="composer-title">
            <div className="composerTop"><div><span>STRUCTURE THE WORK</span><h2 id="composer-title">Create {composer.type}</h2></div><button type="button" onClick={() => setComposer(null)} aria-label="Close">×</button></div>
            {composer.parent && <div className="parentContext"><span>{typeGlyph[composer.parent.type]}</span><div><small>PARENT {composer.parent.type.toUpperCase()}</small><strong>{composer.parent.title}</strong></div></div>}
            <label><span>{composer.type} title</span><input autoFocus value={newTitle} onChange={(event) => setNewTitle(event.target.value)} placeholder={`Describe this ${composer.type.toLowerCase()}`} /></label>
            <div className="composerGrid"><label><span>Priority</span><select value={newPriority} onChange={(event) => setNewPriority(event.target.value as Priority)}><option>Critical</option><option>High</option><option>Medium</option><option>Low</option></select></label><label><span>Assignee</span><select value={newAssignee} onChange={(event) => setNewAssignee(event.target.value)}><option value="AK">Anand K.</option><option value="MS">Maya S.</option><option value="RV">Rahul V.</option><option value="NJ">Nina J.</option><option value="PS">Priya S.</option></select></label><label><span>Story points</span><select value={newPoints} onChange={(event) => setNewPoints(Number(event.target.value))}><option value={1}>1 point</option><option value={2}>2 points</option><option value={3}>3 points</option><option value={5}>5 points</option><option value={8}>8 points</option><option value={13}>13 points</option></select></label></div>
            <div className="composerActions"><button type="button" onClick={() => setComposer(null)}>Cancel</button><button className="primaryStudioButton" type="submit" disabled={!newTitle.trim()}>Create {composer.type} →</button></div>
          </form>
        </div>
      )}
    </main>
  );
}
