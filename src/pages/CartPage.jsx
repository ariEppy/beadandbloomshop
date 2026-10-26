import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { emailErrorReason } from "../utils/emailError";
import CustomerForm from "../components/CustomerForm";
import JewelryIcon from "../components/JewelryIcon";
import QuantityStepper from "../components/QuantityStepper";
import READY_MADE_PRODUCTS from "../data/readyMadeProducts";
import CUSTOM_PIECES, {
  customPieceSummary,
  describeCustomPiece,
} from "../data/customPieces";

const INITIAL_CUSTOMER = {
  name: "",
  phone: "",
  email: "",
  promoCode: "",
  notes: "",
};

function CartPage({
  cart,
  onRemoveReadyMade,
  onRemoveCustom,
  onChangeReadyMadeQuantity,
  onChangeCustomQuantity,
  onClear,
  onNavigate,
}) {
  const form = useRef();

  const [customer, setCustomer] = useState(INITIAL_CUSTOMER);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const readyMadeItems = cart.readyMade
    .map((entry) => {
      const product = READY_MADE_PRODUCTS.find((item) => item.id === entry.id);

      return product && { ...product, quantity: entry.quantity };
    })
    .filter(Boolean);
  const customItems = cart.custom;

  const total =
    readyMadeItems.reduce((sum, item) => sum + item.price * item.quantity, 0) +
    customItems.reduce(
      (sum, piece) => sum + CUSTOM_PIECES[piece.type].price * piece.quantity,
      0,
    );

  const isEmpty = readyMadeItems.length === 0 && customItems.length === 0;

  function updateCustomer(updatedData) {
    setCustomer((previous) => ({
      ...previous,
      ...updatedData,
    }));
  }

  function createOrderSummary() {
    const orderType = [
      readyMadeItems.length > 0 && "READY-MADE",
      customItems.length > 0 && "CUSTOM",
    ]
      .filter(Boolean)
      .join(" + ");

    const sections = [
      ...readyMadeItems.map(
        (item) => `READY-MADE: ${item.name.toUpperCase()}
Price: ₪${item.price} each (${item.quantity} × ₪${item.price} = ₪${item.price * item.quantity})
Quantity: ${item.quantity}
Photo: ${window.location.origin}${item.image}`,
      ),
      ...customItems.map(customPieceSummary),
    ];

    const promoLine = customer.promoCode
      ? `\nPROMO CODE: ${customer.promoCode}`
      : "";

    return `ORDER TYPE: ${orderType}

${sections.join("\n\n------------------------------\n\n")}

==============================

ESTIMATED TOTAL: ₪${total}${promoLine}`;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isEmpty) {
      return;
    }

    setSending(true);
    setError("");

    try {
      await emailjs.sendForm(
        "service_la3nwl5",
        "template_jwsg4ge",
        form.current,
        {
          publicKey: "npd2ceHneydWo-F0e",
        },
      );

      setSent(true);
      setCustomer(INITIAL_CUSTOMER);
      onClear();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (sendError) {
      console.error("EmailJS error:", sendError);

      const reason = emailErrorReason(sendError);

      setError(
        `Something went wrong while sending your order. Please try again.${
          reason ? ` (${reason})` : ""
        }`,
      );
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <main className="page">
        <div className="centered-message">
          <span className="eyebrow">Order received</span>
          <h1>Thank you.</h1>
          <p className="lede">
            Your order is on its way to us. We'll get back to you soon to
            coordinate payment, delivery, and when everything will be ready.
          </p>

          <button
            type="button"
            className="secondary-button"
            onClick={() => onNavigate("home")}
          >
            Back to home
          </button>
        </div>
      </main>
    );
  }

  if (isEmpty) {
    return (
      <main className="page">
        <div className="centered-message">
          <span className="eyebrow">Cart</span>
          <h1>Your cart is empty.</h1>
          <p className="lede">
            Add finished pieces from the collection, design something of your
            own, or both.
          </p>

          <div className="centered-actions">
            <button
              type="button"
              className="primary-button"
              onClick={() => onNavigate("shop")}
            >
              Shop the collection
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={() => onNavigate("custom")}
            >
              Design your own
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="page-intro">
        <span className="eyebrow">Checkout</span>
        <h1>Your cart</h1>
      </div>

      <form ref={form} onSubmit={handleSubmit} className="checkout">
        <div className="checkout-main">
          <section className="checkout-section">
            <h2 className="section-label">Pieces</h2>

            <ul className="cart-list">
              {readyMadeItems.map((item) => (
                <li className="cart-item" key={item.id}>
                  <div className="cart-thumb">
                    <img
                      src={item.image}
                      alt=""
                      style={{ objectPosition: item.imagePosition }}
                    />
                  </div>

                  <div>
                    <span className="cart-tag">Ready-made</span>
                    <h3>{item.name}</h3>
                    <p className="cart-details">
                      {item.description}
                      {item.quantity > 1 && ` · ₪${item.price} each`}
                    </p>
                  </div>

                  <div className="cart-item-side">
                    <span className="cart-price">
                      ₪{item.price * item.quantity}
                    </span>

                    <QuantityStepper
                      value={item.quantity}
                      onChange={(quantity) =>
                        onChangeReadyMadeQuantity(item.id, quantity)
                      }
                      label={`Quantity of ${item.name}`}
                    />

                    <button
                      type="button"
                      className="cart-remove"
                      onClick={() => onRemoveReadyMade(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}

              {customItems.map((piece) => {
                const { title, price } = CUSTOM_PIECES[piece.type];
                const details = describeCustomPiece(piece);

                return (
                  <li className="cart-item" key={piece.cartId}>
                    <div className="cart-thumb">
                      {piece.inspirationImageUrl ? (
                        <img src={piece.inspirationImageUrl} alt="" />
                      ) : (
                        <JewelryIcon type={piece.type} size={30} />
                      )}
                    </div>

                    <div>
                      <span className="cart-tag">Custom design</span>
                      <h3>{title}</h3>
                      <p className="cart-details">
                        {details || "Details to be discussed"}
                        {piece.quantity > 1 && ` · ₪${price} each`}
                      </p>
                    </div>

                    <div className="cart-item-side">
                      <span className="cart-price">
                        ₪{price * piece.quantity}
                      </span>

                      <QuantityStepper
                        value={piece.quantity}
                        onChange={(quantity) =>
                          onChangeCustomQuantity(piece.cartId, quantity)
                        }
                        label={`Quantity of ${title}`}
                      />

                      <button
                        type="button"
                        className="cart-remove"
                        onClick={() => onRemoveCustom(piece.cartId)}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="cart-add-more">
              <button
                type="button"
                className="text-link"
                onClick={() => onNavigate("shop")}
              >
                + Add ready-made
              </button>

              <button
                type="button"
                className="text-link"
                onClick={() => onNavigate("custom")}
              >
                + Add a custom design
              </button>
            </div>
          </section>

          <section className="checkout-section">
            <h2 className="section-label">Your details</h2>
            <CustomerForm customer={customer} onChange={updateCustomer} />
          </section>
        </div>

        <aside className="checkout-summary">
          <h2 className="section-label">Summary</h2>

          {readyMadeItems.map((item) => (
            <div className="summary-row" key={item.id}>
              <span>
                {item.name}
                {item.quantity > 1 && ` × ${item.quantity}`}
              </span>
              <span>₪{item.price * item.quantity}</span>
            </div>
          ))}

          {customItems.map((piece) => (
            <div className="summary-row" key={piece.cartId}>
              <span>
                {CUSTOM_PIECES[piece.type].title}
                {piece.quantity > 1 && ` × ${piece.quantity}`}
              </span>
              <span>₪{CUSTOM_PIECES[piece.type].price * piece.quantity}</span>
            </div>
          ))}

          <div className="summary-total">
            <span>Estimated total</span>
            <strong>₪{total}</strong>
          </div>

          <p className="summary-note">
            No payment is taken now. After you send your order, Bead &amp;
            Bloom will reach out to coordinate payment, delivery, and timing.
          </p>

          <button
            type="submit"
            className="primary-button full-button"
            disabled={sending}
          >
            {sending ? "Sending…" : "Send my order"}
          </button>

          {error && <p className="form-error">{error}</p>}
        </aside>

        <input type="hidden" name="order_summary" value={createOrderSummary()} />
      </form>
    </main>
  );
}

export default CartPage;
