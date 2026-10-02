import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import JewelryOption from "../components/JewelryOption";
import CustomerForm from "../components/CustomerForm";
import logo from "../assets/logo.png";

const INITIAL_ORDER = {
  necklace: {
    selected: false,
    quantity: 1,
    colors: [],
    length: "",
    charms: [],
    style: "",
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
    style: "",
    description: "",
    inspirationImageUrl: "",
  },

  earrings: {
    selected: false,
    quantity: 1,
    colors: [],
    charms: [],
    style: "",
    earringType: "",
    description: "",
    inspirationImageUrl: "",
  },

  customer: {
    name: "",
    phone: "",
    email: "",
    promoCode: "",
    notes: "",
  },
};

const PRICES = {
  necklace: 140,
  braceletAnklet: 80,
  earrings: 70,
};

const JEWELRY_TYPES = [
  {
    key: "necklace",
    title: "Custom Necklace",

    icon: (
      <svg
        viewBox="0 0 32 32"
        width="34"
        height="34"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M7 8 C 9 20, 23 20, 25 8" />
        <circle cx="16" cy="20.5" r="2.7" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    key: "braceletAnklet",
    title: "Custom Bracelet / Anklet",

    icon: (
      <svg
        viewBox="0 0 32 32"
        width="34"
        height="34"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <ellipse cx="16" cy="16" rx="10" ry="8" />
        <circle cx="26" cy="16" r="1.9" fill="currentColor" stroke="none" />
        <circle
          cx="23.07"
          cy="21.66"
          r="1.9"
          fill="currentColor"
          stroke="none"
        />
        <circle cx="16" cy="24" r="1.9" fill="currentColor" stroke="none" />
        <circle
          cx="8.93"
          cy="21.66"
          r="1.9"
          fill="currentColor"
          stroke="none"
        />
        <circle cx="6" cy="16" r="1.9" fill="currentColor" stroke="none" />
        <circle
          cx="8.93"
          cy="10.34"
          r="1.9"
          fill="currentColor"
          stroke="none"
        />
        <circle cx="16" cy="8" r="1.9" fill="currentColor" stroke="none" />
        <circle
          cx="23.07"
          cy="10.34"
          r="1.9"
          fill="currentColor"
          stroke="none"
        />
      </svg>
    ),
  },
  {
    key: "earrings",
    title: "Custom Earrings",

    icon: (
      <svg
        viewBox="0 0 32 32"
        width="34"
        height="34"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="7.5" r="1.9" />
        <path d="M11 9.4 L11 12" />
        <path
          d="M11 12 C6.5 16, 6.5 21, 11 22 C15.5 21, 15.5 16, 11 12 Z"
          fill="currentColor"
          stroke="none"
        />
        <circle cx="21" cy="7.5" r="1.9" />
        <path d="M21 9.4 L21 12" />
        <path
          d="M21 12 C16.5 16, 16.5 21, 21 22 C25.5 21, 25.5 16, 21 12 Z"
          fill="currentColor"
          stroke="none"
        />
      </svg>
    ),
  },
];

function OrderPage() {
  const form = useRef();

  const [order, setOrder] = useState(INITIAL_ORDER);
  const [step, setStep] = useState(1);
  const [customizingIndex, setCustomizingIndex] = useState(0);
  const [status, setStatus] = useState("");

  const selectedJewelry = JEWELRY_TYPES.filter(
    (item) => order[item.key].selected,
  );

  const orderTotal = selectedJewelry.reduce(
    (sum, item) => sum + PRICES[item.key] * order[item.key].quantity,
    0,
  );

  function updateJewelry(type, updatedData) {
    setOrder((previousOrder) => ({
      ...previousOrder,
      [type]: {
        ...previousOrder[type],
        ...updatedData,
      },
    }));
  }

  function updateCustomer(updatedData) {
    setOrder((previousOrder) => ({
      ...previousOrder,
      customer: {
        ...previousOrder.customer,
        ...updatedData,
      },
    }));
  }

  function toggleJewelry(type) {
    const currentlySelected = order[type].selected;

    updateJewelry(type, {
      selected: !currentlySelected,
    });

    if (!currentlySelected) {
      setStatus("");
    }
  }

  function goToCustomization() {
    if (selectedJewelry.length === 0) {
      setStatus("Please choose at least one type of jewelry.");
      return;
    }

    setStatus("");
    setCustomizingIndex(0);
    setStep(2);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function goToNextPiece() {
    if (customizingIndex < selectedJewelry.length - 1) {
      setCustomizingIndex((previous) => previous + 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      setStep(3);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  function goToPreviousPiece() {
    if (customizingIndex > 0) {
      setCustomizingIndex((previous) => previous - 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      setStep(1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  function goBackToCustomization() {
    setStep(2);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function goHome() {
    setStatus("");
    setCustomizingIndex(0);
    setStep(1);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function createOrderSummary() {
    const items = [];

    if (order.necklace.selected) {
      items.push(`CUSTOM NECKLACE
Price: ₪${PRICES.necklace} each (${order.necklace.quantity} × ₪${PRICES.necklace} = ₪${PRICES.necklace * order.necklace.quantity})
Quantity: ${order.necklace.quantity}
Colors: ${order.necklace.colors.join(", ") || "Not specified"}
Length: ${order.necklace.length || "Not specified"}
Charms: ${order.necklace.charms.join(", ") || "None"}
Style: ${
        order.necklace.style ? `Style ${order.necklace.style}` : "Not specified"
      }
Description: ${order.necklace.description || "No additional description"}
Inspiration Picture: ${order.necklace.inspirationImageUrl || "None uploaded"}`);
    }

    if (order.braceletAnklet.selected) {
      items.push(`CUSTOM BRACELET / ANKLET
Price: ₪${PRICES.braceletAnklet} each (${order.braceletAnklet.quantity} × ₪${PRICES.braceletAnklet} = ₪${PRICES.braceletAnklet * order.braceletAnklet.quantity})
Type: ${order.braceletAnklet.jewelryType || "Not specified"}
Quantity: ${order.braceletAnklet.quantity}
Colors: ${order.braceletAnklet.colors.join(", ") || "Not specified"}
Length: ${order.braceletAnklet.length || "Not specified"}
Charms: ${order.braceletAnklet.charms.join(", ") || "None"}
Style: ${
        order.braceletAnklet.style
          ? `Style ${order.braceletAnklet.style}`
          : "Not specified"
      }
Description: ${order.braceletAnklet.description || "No additional description"}
Inspiration Picture: ${
        order.braceletAnklet.inspirationImageUrl || "None uploaded"
      }`);
    }

    if (order.earrings.selected) {
      items.push(`CUSTOM EARRINGS
Price: ₪${PRICES.earrings} each (${order.earrings.quantity} × ₪${PRICES.earrings} = ₪${PRICES.earrings * order.earrings.quantity})
Quantity: ${order.earrings.quantity}
Colors: ${order.earrings.colors.join(", ") || "Not specified"}
Charms: ${order.earrings.charms.join(", ") || "None"}
Earring Style: ${order.earrings.earringType || "Not specified"}
Design Style: ${
        order.earrings.style ? `Style ${order.earrings.style}` : "Not specified"
      }
Description: ${order.earrings.description || "No additional description"}
Inspiration Picture: ${order.earrings.inspirationImageUrl || "None uploaded"}`);
    }

    const summary = items.join("\n\n------------------------------\n\n");

    const promoLine = order.customer.promoCode
      ? `\nPROMO CODE: ${order.customer.promoCode}`
      : "";

    return `${summary}\n\n==============================\n\nESTIMATED TOTAL: ₪${orderTotal}${promoLine}`;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (selectedJewelry.length === 0) {
      setStatus("Please choose at least one type of jewelry.");
      setStep(1);
      return;
    }

    setStatus("Sending your design...");

    try {
      await emailjs.sendForm(
        "service_la3nwl5",
        "template_jwsg4ge",
        form.current,
        {
          publicKey: "npd2ceHneydWo-F0e",
        },
      );

      setStatus(
        "Thank you! Your order has been received. We'll get back to you soon to coordinate payment, delivery, and when your jewelry will be ready.",
      );

      setOrder({
        ...INITIAL_ORDER,
        customer: {
          name: "",
          phone: "",
          email: "",
          promoCode: "",
          notes: "",
        },
      });

      setStep(1);
      setCustomizingIndex(0);
    } catch (error) {
      console.error("EmailJS error:", error);

      setStatus(
        "Something went wrong while sending your order. Please try again.",
      );
    }
  }

  const currentJewelry = selectedJewelry[customizingIndex];

  return (
    <main className="order-page">
      <header className="site-header">
        <button
          type="button"
          className="logo-button"
          onClick={goHome}
          aria-label="Bead & Bloom — back to start"
        >
          <img src={logo} alt="Bead & Bloom" className="logo" />
        </button>

        <p className="intro-text">
          Design your own custom piece below. Once you send your design, Bead
          &amp; Bloom will get back to you to coordinate delivery, when it will
          be ready, and all the details.
        </p>
      </header>

      <form ref={form} onSubmit={handleSubmit} className="order-form">
        {step === 1 && (
          <section className="design-step">
            <div className="step-heading">
              <h2>What would you like to create?</h2>
            </div>

            <div className="jewelry-choice-grid">
              {JEWELRY_TYPES.map((item) => {
                const selected = order[item.key].selected;

                return (
                  <button
                    type="button"
                    key={item.key}
                    className={`jewelry-choice-card ${
                      selected ? "selected" : ""
                    }`}
                    onClick={() => toggleJewelry(item.key)}
                  >
                    <span className="choice-icon">{item.icon}</span>

                    <span className="choice-title">{item.title}</span>
                  </button>
                );
              })}
            </div>

            {selectedJewelry.length > 0 && (
              <div className="selected-summary">
                <span>
                  You've selected <strong>{selectedJewelry.length}</strong>{" "}
                  {selectedJewelry.length === 1 ? "piece" : "pieces"}.
                </span>
              </div>
            )}

            {status && <div className="error-message">{status}</div>}

            <button
              type="button"
              className="primary-button"
              onClick={goToCustomization}
            >
              Start Designing →
            </button>
          </section>
        )}

        {step === 2 && currentJewelry && (
          <section className="design-step">
            <div className="step-heading">
              <div className="step-heading">
                <h2>{currentJewelry.title}</h2>
              </div>
            </div>

            {selectedJewelry.length > 1 && (
              <div className="piece-progress">
                <span>
                  Piece {customizingIndex + 1} of {selectedJewelry.length}
                </span>

                <div className="piece-progress-bar">
                  <div
                    style={{
                      width: `${
                        ((customizingIndex + 1) / selectedJewelry.length) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            )}

            <JewelryOption
              title={currentJewelry.title}
              type={currentJewelry.key}
              data={order[currentJewelry.key]}
              onChange={updateJewelry}
            />

            <div className="navigation-buttons">
              <button
                type="button"
                className="secondary-button"
                onClick={goToPreviousPiece}
              >
                ← Back
              </button>

              <button
                type="button"
                className="primary-button"
                onClick={goToNextPiece}
              >
                {customizingIndex < selectedJewelry.length - 1
                  ? "Next Piece →"
                  : "Continue →"}
              </button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="design-step">
            <div className="step-heading">
              <h2>Tell us where to reach you</h2>
            </div>

            <div className="review-card">
              <div className="review-header">
                <h3>Your Design</h3>

                <button
                  type="button"
                  className="edit-button"
                  onClick={() => {
                    setCustomizingIndex(0);
                    setStep(2);
                  }}
                >
                  Edit
                </button>
              </div>

              {selectedJewelry.map((item) => (
                <div className="review-item" key={item.key}>
                  <div>
                    <strong>{item.title}</strong>

                    <span>
                      Quantity: {order[item.key].quantity} × ₪{PRICES[item.key]}
                    </span>

                    {order[item.key].inspirationImageUrl && (
                      <span className="review-upload">
                        ✓ Inspiration picture uploaded
                      </span>
                    )}
                  </div>

                  <span className="review-price">
                    ₪{PRICES[item.key] * order[item.key].quantity}
                  </span>
                </div>
              ))}

              <div className="review-total">
                <strong>Estimated Total</strong>

                <strong>₪{orderTotal}</strong>
              </div>
            </div>

            <CustomerForm customer={order.customer} onChange={updateCustomer} />

            <input
              type="hidden"
              name="order_summary"
              value={createOrderSummary()}
            />

            <p className="submit-note">
              This is a request form - no payment is taken now. After you send
              your design, Bead &amp; Bloom will reach out to coordinate
              delivery, when your piece will be ready, and the final details.
            </p>

            <div className="navigation-buttons">
              <button
                type="button"
                className="secondary-button"
                onClick={goBackToCustomization}
              >
                ← Back
              </button>

              <button type="submit" className="primary-button">
                Send My Design →
              </button>
            </div>

            {status && <div className="status-message">{status}</div>}
          </section>
        )}
      </form>
    </main>
  );
}

export default OrderPage;
