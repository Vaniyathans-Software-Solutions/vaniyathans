/** Light line drawings connect the existing sketchbook style to Kerala. */
export default function BackgroundDoodles({ variant = "discover" }: { variant?: "hero" | "process" | "discover" | "shape" | "launch" | "contact" }) {
  return (
    <div className={`backgroundDoodles doodles-${variant}`} aria-hidden="true">
      <svg className="doodle keralaPalm" viewBox="0 0 120 150" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" focusable="false">
        <path d="M48 139c17-30 20-60 16-91M58 139c14-33 17-62 10-91M65 48C42 22 18 32 9 54c19-12 39-13 56-6ZM65 48C47 10 72 6 88 16 74 20 67 31 65 48ZM67 48c24-28 42-15 47 4-16-9-32-10-47-4ZM65 49C42 43 27 60 28 80c9-14 21-24 37-31ZM68 49c26 1 33 20 26 40-4-17-12-30-26-40Z" />
        <path d="M20 143c15-6 29-6 44 0s27 6 41 0" />
      </svg>
      <svg className="doodle keralaBackwater" viewBox="0 0 180 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" focusable="false">
        <path d="M17 58h147c-15 19-34 23-70 23S37 77 17 58ZM46 56V41c0-24 86-24 86 0v15M54 37h69M67 32v24M91 30v26M114 33v23M16 88c15-5 23 5 38 0s23 5 38 0 23 5 38 0 23 5 38 0M34 97c15-5 23 5 38 0s23 5 38 0 23 5 38 0" />
      </svg>
      <span className="doodle doodleOrbit"><i /></span>
      <span className="doodle doodleSpark"><i /></span>
      <span className="doodle doodleWave"><i /><i /><i /><i /></span>
      <span className="doodle doodleCode">{ "{ }" }</span>
      <span className="doodle doodleArrow"><i /></span>
      <span className="doodle doodleTiles"><i /><i /><i /></span>
      <span className="doodle doodleDots"><i /></span>
      <span className="doodle doodleLoop"><i /></span>
    </div>
  );
}
