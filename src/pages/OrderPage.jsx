import { useState } from "react";
import JewelryOption from "../components/JewelryOption";
import JewelryIcon from "../components/JewelryIcon";
import CUSTOM_PIECES from "../data/customPieces";

const EMPTY_DESIGN = {
  necklace: {
    selected: false,
    quantity: 1,
    colors: [],
    length: "",
    charms: [],
    description: "",
    inspirationImageUrl: "",
  },

  braceletAnklet: {
    selected: false,
    quantity: 1,
    jewelryType: "",
    colors: [],
    length: "",
    charms: [],
    description: "",
    inspirationImageUrl: "",
  },

  earrings: {
    selected: false,
    quantity: 1,
    colors: [],
    charms: [],
    earringType: "",
    description: "",
    inspirationImageUrl: "",
  },
};

const PIECE_TYPES = Object.keys(CUSTOM_PIECES);

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function OrderPage({ onAddToCart, onCancel }) {
  const [design, setDesign] = useState(EMPTY_DESIGN);
  const [step, setStep] = useState(1);
  const [customizingIndex, setCustomizingIndex] = useState(0);
  const [error, setError] = useState("");

  const selectedTypes = PIECE_TYPES.filter((type) => design[type].selected);
  const currentType = selectedTypes[customizingIndex];
  const isLastPiece = customizingIndex === selectedTypes.length - 1;

  const designTotal = selectedTypes.reduce(
    (sum, type) => sum + CUSTOM_PIECES[type].price * design[type].quantity,
    0,
  );

  function updatePiece(type, updatedData) {
    setDesign((previous) => ({
      ...previous,
      [type]: {
        ...previous[type],
        ...updatedData,
      },
    }));
  }

  function togglePiece(type) {
    updatePiece(type, {
      selected: !design[type].selected,
    });

    setError("");
  }

  function startDesigning() {
    if (selectedTypes.length === 0) {
      setError("Please choose at least one type of jewelry.");
      return;
    }

    setError("");
    setCustomizingIndex(0);
    setStep(2);
    scrollToTop();
  }

  function addToCart() {
    const pieces = selectedTypes.map((type, index) => {
      const details = { ...design[type] };
      delete details.selected;

      return {
        cartId: `${type}-${Date.now()}-${index}`,
        type,
        ...details,
      };
    });

    onAddToCart(pieces);
  }

  function goToNextPiece() {
    if (isLastPiece) {
      addToCart();
      return;
    }

    setCustomizingIndex((previous) => previous + 1);
    scrollToTop();
  }

  function goToPreviousPiece() {
    if (customizingIndex > 0) {
      setCustomizingIndex((previous) => previous - 1);
    } else {
      setStep(1);
    }

    scrollToTop();
  }

  return (
    <main className="page">
      <div className="page-intro">
        <span className="eyebrow">Custom order</span>
        <h1>Design your own</h1>
        <p className="lede">
          Choose what you'd like made, then pick colors, length and charms.
        </p>
      </div>

      {step === 1 && (
        <section className="design-step">
          <h2 className="step-title">What would you like made?</h2>

          <div className="jewelry-choice-grid">
            {PIECE_TYPES.map((type) => {
              const selected = design[type].selected;

              return (
                <button
                  type="button"
                  key={type}
                  className={`jewelry-choice-card ${selected ? "selected" : ""}`}
                  aria-pressed={selected}
                  onClick={() => togglePiece(type)}
                >
                  <span className="choice-check" aria-hidden="true">
                    ✓
                  </span>

                  <span className="choice-icon">
                    <JewelryIcon type={type} />
                  </span>

                  <span className="choice-text">
                    <span className="choice-title">
                      {CUSTOM_PIECES[type].label}
                    </span>
                    <span className="choice-price">
                      ₪{CUSTOM_PIECES[type].price}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="navigation-buttons">
            <button
              type="button"
              className="secondary-button"
              onClick={onCancel}
            >
              Back
            </button>

            <button
              type="button"
              className="primary-button"
              onClick={startDesigning}
            >
              {selectedTypes.length > 1
                ? `Design ${selectedTypes.length} pieces`
                : "Start designing"}
            </button>
          </div>
        </section>
      )}

      {step === 2 && currentType && (
        <section className="design-step">
          <div className="step-header">
            <h2 className="step-title">{CUSTOM_PIECES[currentType].title}</h2>

            {selectedTypes.length > 1 && (
              <span className="step-count">
                Piece {customizingIndex + 1} of {selectedTypes.length}
              </span>
            )}
          </div>

          {selectedTypes.length > 1 && (
            <div className="piece-progress-bar">
              <div
                style={{
                  width: `${
                    ((customizingIndex + 1) / selectedTypes.length) * 100
                  }%`,
                }}
              />
            </div>
          )}

          <JewelryOption
            type={currentType}
            data={design[currentType]}
            onChange={updatePiece}
          />

          <div className="navigation-buttons">
            <button
              type="button"
              className="secondary-button"
              onClick={goToPreviousPiece}
            >
              Back
            </button>

            <button
              type="button"
              className="primary-button"
              onClick={goToNextPiece}
            >
              {isLastPiece ? `Add to cart · ₪${designTotal}` : "Next piece"}
            </button>
          </div>
        </section>
      )}
    </main>
  );
}

export default OrderPage;
