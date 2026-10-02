import { useState } from "react";
import ImageUpload from "./ImageUpload";

const COLORS = [
  "White",
  "Black",
  "Pink",
  "Light Pink",
  "Red",
  "Orange",
  "Yellow",
  "Green",
  "Light Green",
  "Blue",
  "Light Blue",
  "Purple",
  "Lavender",
  "Gold",
  "Silver",
  "Clear",
  "Pearl",
  "Multicolor",
];

const NECKLACE_LENGTHS = [
  "Choker (35–41 cm)",
  "Princess (45–46 cm)",
  "Matinee (50–61 cm)",
  "Opera (71–91 cm)",
  "Lariat (94 cm+)",
];

const BRACELET_LENGTHS = [
  "Small (15–17 cm)",
  "Medium (18–19 cm)",
  "Large (20–23 cm)",
];

const ANKLET_LENGTHS = [
  "Small (22–23 cm)",
  "Medium (24–25 cm)",
  "Large (27–28 cm)",
];

const CHARMS = [
  "Flowers",
  "Hearts",
  "Stars",
  "Butterflies",
  "Animals",
  "Letters",
  "Smiley Faces",
  "Food & Drinks",
  "Nature",
  "Shells",
  "Celestial",
  "Music",
  "Sports",
  "Other",
];

function MultiSelectDropdown({ label, options, selected, onChange }) {
  const [open, setOpen] = useState(false);

  function toggleOption(option) {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  }

  return (
    <div className="multi-select">
      <button
        type="button"
        className={`dropdown-button ${open ? "open" : ""}`}
        onClick={() => setOpen((previous) => !previous)}
      >
        <span className="dropdown-value">
          {selected.length > 0
            ? selected.join(", ")
            : `Choose ${label.toLowerCase()}`}
        </span>

        <span className="dropdown-arrow">{open ? "⌃" : "⌄"}</span>
      </button>

      {open && (
        <div className="dropdown-options">
          {options.map((option) => (
            <label key={option} className="checkbox-option">
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => toggleOption(option)}
              />

              <span>{option}</span>
            </label>
          ))}

          <button
            type="button"
            className="dropdown-done"
            onClick={() => setOpen(false)}
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}

function JewelryOption({ type, data, onChange }) {
  function update(field, value) {
    onChange(type, {
      [field]: value,
    });
  }

  let lengths = [];

  if (type === "necklace") {
    lengths = NECKLACE_LENGTHS;
  }

  if (type === "braceletAnklet") {
    if (data.jewelryType === "Bracelet") {
      lengths = BRACELET_LENGTHS;
    }

    if (data.jewelryType === "Anklet") {
      lengths = ANKLET_LENGTHS;
    }
  }

  return (
    <div className="customization-card">
      <div className="customization-card-top">
        <div className="quantity-box">
          <span>Quantity</span>

          <input
            type="number"
            min="1"
            name={`${type}_quantity`}
            value={data.quantity}
            onChange={(event) =>
              update("quantity", Math.max(1, Number(event.target.value)))
            }
          />
        </div>
      </div>

      <div className="customization-fields">
        {type === "braceletAnklet" && (
          <label>
            <span className="field-label">What would you like?</span>

            <select
              name="bracelet_anklet_type"
              value={data.jewelryType}
              onChange={(event) => {
                update("jewelryType", event.target.value);

                update("length", "");
              }}
            >
              <option value="">Choose one</option>
              <option value="Bracelet">Bracelet</option>
              <option value="Anklet">Anklet</option>
            </select>
          </label>
        )}

        <div>
          <span className="field-label">Colors</span>

          <MultiSelectDropdown
            label="Colors"
            options={COLORS}
            selected={data.colors}
            onChange={(value) => update("colors", value)}
          />
        </div>

        {lengths.length > 0 && (
          <label>
            <span className="field-label">Length</span>

            <select
              name={`${type}_length`}
              value={data.length}
              onChange={(event) => update("length", event.target.value)}
            >
              <option value="">Choose a length</option>

              {lengths.map((length) => (
                <option key={length} value={length}>
                  {length}
                </option>
              ))}
            </select>
          </label>
        )}

        <div>
          <span className="field-label">Charms</span>

          <MultiSelectDropdown
            label="Charms"
            options={CHARMS}
            selected={data.charms}
            onChange={(value) => update("charms", value)}
          />
        </div>

        {type === "earrings" && (
          <label>
            <span className="field-label">Earring Style</span>

            <select
              name="earrings_type"
              value={data.earringType}
              onChange={(event) => update("earringType", event.target.value)}
            >
              <option value="">Choose a style</option>
              <option value="Dangle">Dangle</option>
              <option value="Clip-on">Clip-on</option>
            </select>
          </label>
        )}
      </div>
      <ImageUpload
        imageUrl={data.inspirationImageUrl}
        onUploaded={(url) => update("inspirationImageUrl", url)}
        onRemoved={() => update("inspirationImageUrl", "")}
      />
      <label className="description-field">
        <span className="field-label">Tell us about your vision</span>

        <span className="field-helper">
          Have something specific in mind? Describe it here — the more you tell
          us, the better!
        </span>

        <textarea
          name={`${type}_description`}
          placeholder="For example: I'd love something colorful with a beachy feel..."
          value={data.description}
          onChange={(event) => update("description", event.target.value)}
        />
      </label>
    </div>
  );
}

export default JewelryOption;
