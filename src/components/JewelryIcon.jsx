function JewelryIcon({ type, size = 34 }) {
  const shared = {
    viewBox: "0 0 32 32",
    width: size,
    height: size,
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  if (type === "necklace") {
    return (
      <svg {...shared} strokeWidth="1.3">
        <path d="M7 7 C 9 20, 23 20, 25 7" />
        <circle cx="16" cy="21.5" r="2.6" />
      </svg>
    );
  }

  if (type === "braceletAnklet") {
    return (
      <svg {...shared} strokeWidth="1.3">
        <ellipse cx="16" cy="16" rx="10" ry="8" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
          const radians = (angle * Math.PI) / 180;

          return (
            <circle
              key={angle}
              cx={16 + 10 * Math.cos(radians)}
              cy={16 + 8 * Math.sin(radians)}
              r="1.6"
              fill="currentColor"
              stroke="none"
            />
          );
        })}
      </svg>
    );
  }

  return (
    <svg {...shared} strokeWidth="1.3">
      <circle cx="11" cy="7.5" r="1.8" />
      <path d="M11 9.3 L11 12" />
      <path d="M11 12 C6.5 16, 6.5 21, 11 22 C15.5 21, 15.5 16, 11 12 Z" />
      <circle cx="21" cy="7.5" r="1.8" />
      <path d="M21 9.3 L21 12" />
      <path d="M21 12 C16.5 16, 16.5 21, 21 22 C25.5 21, 25.5 16, 21 12 Z" />
    </svg>
  );
}

export default JewelryIcon;
