// One-line version of logo.png: "BEAD AND BLOOM" on white letter beads.
// Drawn inline (not as an <img>) so the letters can use the page's Nunito font.
// Colors are taken from the beads in logo.png.

const WORDS = [
  [
    { letter: "B", color: "#ff66c4" },
    { letter: "E", color: "#38b6ff" },
    { letter: "A", color: "#ff7a1c" },
    { letter: "D", color: "#dfa6ee" },
  ],
  [
    { letter: "A", color: "#0097b2" },
    { letter: "N", color: "#0047ab" },
    { letter: "D", color: "#ffbd59" },
  ],
  [
    { letter: "B", color: "#5271ff" },
    { letter: "L", color: "#5e17eb" },
    { letter: "O", color: "#4caf50" },
    { letter: "O", color: "#ff66c4" },
    { letter: "M", color: "#8c52ff" },
  ],
];

const RADIUS = 24;
const STEP = 44; // distance between bead centers; < 2 × RADIUS so beads touch
const WORD_GAP = 12;
const PADDING = 4;
const BASE_Y = 31;

// Small, hand-placed tilts and bobs so the string looks strung, not typeset.
const TILTS = [-14, -8, 4, 10, 8, -6, 10, -10, 6, -4, 8, 12];
const BOBS = [3, 0, -3, -1, 1, 3, 0, 1, -2, -3, 0, 2];

function layoutBeads() {
  const beads = [];
  let x = PADDING + RADIUS;

  WORDS.forEach((word, wordIndex) => {
    if (wordIndex > 0) {
      x += WORD_GAP;
    }

    word.forEach((bead) => {
      const index = beads.length;

      beads.push({
        ...bead,
        x,
        y: BASE_Y + BOBS[index],
        tilt: TILTS[index],
      });

      x += STEP;
    });
  });

  return { beads, width: x - STEP + RADIUS + PADDING };
}

const { beads: BEADS, width: WIDTH } = layoutBeads();
const HEIGHT = BASE_Y + 3 + RADIUS + 4 + PADDING;

function LogoWordmark({ className }) {
  return (
    <svg
      className={className}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      aria-hidden="true"
      focusable="false"
    >
      {BEADS.map((bead, index) => (
        <g key={index}>
          {/* Bead edge / shadow underneath */}
          <circle cx={bead.x} cy={bead.y + 3.5} r={RADIUS} fill="#d6d8dc" />

          {/* Bead face */}
          <circle cx={bead.x} cy={bead.y} r={RADIUS} fill="#f6f7f9" />
          <circle
            cx={bead.x}
            cy={bead.y}
            r={RADIUS - 2.5}
            fill="none"
            stroke="#e8eaee"
            strokeWidth="2"
          />

          <text
            x={bead.x}
            y={bead.y}
            transform={`rotate(${bead.tilt} ${bead.x} ${bead.y})`}
            textAnchor="middle"
            dominantBaseline="central"
            fill={bead.color}
            fontFamily="Nunito, 'Varela Round', Arial, sans-serif"
            fontWeight="800"
            fontSize="29"
          >
            {bead.letter}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default LogoWordmark;
