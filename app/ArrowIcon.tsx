type ArrowDirection = "right" | "left" | "up-right" | "down-right";

const paths: Record<ArrowDirection, string> = {
  right: "M5 12h14m-6-6 6 6-6 6",
  left: "M19 12H5m6-6-6 6 6 6",
  "up-right": "M6 18 18 6M6 6h12v12",
  "down-right": "M6 6l12 12M6 18h12V6",
};

/** Decorative, font-independent arrow for links and buttons. */
export default function ArrowIcon({ direction = "right" }: { direction?: ArrowDirection }) {
  return (
    <svg
      className="arrowIcon"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={paths[direction]} />
    </svg>
  );
}
