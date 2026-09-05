/** Decorative CSS drawings keep the background light and resolution-independent. */
export default function BackgroundDoodles({ variant = "discover" }: { variant?: "hero" | "process" | "discover" | "shape" | "launch" | "contact" }) {
  return (
    <div className={`backgroundDoodles doodles-${variant}`} aria-hidden="true">
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
