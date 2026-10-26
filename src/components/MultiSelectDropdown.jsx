import { useState } from "react";

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

export default MultiSelectDropdown;
