import ImageUpload from "./ImageUpload";
import MultiSelectDropdown from "./MultiSelectDropdown";
import {
  ANKLET_LENGTHS,
  BRACELET_LENGTHS,
  CHARMS,
  COLORS,
  NECKLACE_LENGTHS,
} from "../data/jewelryOptions";

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
