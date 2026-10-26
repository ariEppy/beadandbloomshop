import { useState } from "react";
import QuantityStepper from "../components/QuantityStepper";
import READY_MADE_PRODUCTS, {
  CATEGORY_LABELS,
} from "../data/readyMadeProducts";

// Only show filter chips for categories that actually have products.
const CATEGORIES = Object.keys(CATEGORY_LABELS).filter((category) =>
  READY_MADE_PRODUCTS.some((product) => product.category === category),
);

function ShopPage({ cartItems, onAdd, onRemove, onChangeQuantity }) {
  const [category, setCategory] = useState("all");

  // Quantity picked on a card before it's added to the cart, by product id.
  const [pendingQuantities, setPendingQuantities] = useState({});

  const visibleProducts =
    category === "all"
      ? READY_MADE_PRODUCTS
      : READY_MADE_PRODUCTS.filter((product) => product.category === category);

  return (
    <main className="page">
      <div className="page-intro">
        <span className="eyebrow">Ready-made</span>
        <h1>The collection</h1>
        <p className="lede">Finished pieces, ready to wear.</p>
      </div>

      {CATEGORIES.length > 1 && (
        <div className="category-filter">
          <button
            type="button"
            className={`category-chip ${category === "all" ? "active" : ""}`}
            onClick={() => setCategory("all")}
          >
            All
          </button>

          {CATEGORIES.map((key) => (
            <button
              type="button"
              key={key}
              className={`category-chip ${category === key ? "active" : ""}`}
              onClick={() => setCategory(key)}
            >
              {CATEGORY_LABELS[key]}
            </button>
          ))}
        </div>
      )}

      <div className="product-grid">
        {visibleProducts.map((product) => {
          const cartEntry = cartItems.find((entry) => entry.id === product.id);
          const inCart = Boolean(cartEntry);
          const quantity = inCart
            ? cartEntry.quantity
            : pendingQuantities[product.id] || 1;

          function changeQuantity(nextQuantity) {
            if (inCart) {
              onChangeQuantity(product.id, nextQuantity);
            } else {
              setPendingQuantities((previous) => ({
                ...previous,
                [product.id]: nextQuantity,
              }));
            }
          }

          function toggleCart() {
            if (inCart) {
              onRemove(product.id);
            } else {
              onAdd(product.id, quantity);
            }
          }

          return (
            <article
              key={product.id}
              className={`product-card ${inCart ? "in-cart" : ""} ${
                product.available ? "" : "sold-out"
              }`}
            >
              <div className="product-image">
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ objectPosition: product.imagePosition }}
                />

                {!product.available && (
                  <span className="product-badge">Sold out</span>
                )}
              </div>

              <div className="product-info">
                <div className="product-title-row">
                  <h3>{product.name}</h3>
                  <span className="product-price">₪{product.price}</span>
                </div>

                <p className="product-description">{product.description}</p>

                <div className="product-actions">
                  {product.available && (
                    <QuantityStepper
                      value={quantity}
                      onChange={changeQuantity}
                      label={`Quantity of ${product.name}`}
                    />
                  )}

                  <button
                    type="button"
                    className="product-button"
                    onClick={toggleCart}
                    disabled={!product.available}
                  >
                    {!product.available
                      ? "Sold out"
                      : inCart
                        ? "In cart ✓"
                        : "Add to cart"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}

export default ShopPage;
