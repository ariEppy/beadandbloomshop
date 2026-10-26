import { useEffect, useState } from "react";
import SiteHeader from "./components/SiteHeader";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import OrderPage from "./pages/OrderPage";
import CartPage from "./pages/CartPage";
import EventPage from "./pages/EventPage";
import READY_MADE_PRODUCTS from "./data/readyMadeProducts";

const CART_STORAGE_KEY = "bead-bloom-cart";

// readyMade: [{ id, quantity }]. custom: designed pieces (see OrderPage).
const EMPTY_CART = { readyMade: [], custom: [] };

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_STORAGE_KEY));

    if (saved && Array.isArray(saved.readyMade) && Array.isArray(saved.custom)) {
      return {
        readyMade: saved.readyMade
          // Older carts stored bare product ids.
          .map((entry) =>
            typeof entry === "string" ? { id: entry, quantity: 1 } : entry,
          )
          // Drop anything that has since sold out or been removed from the shop.
          .filter((entry) =>
            READY_MADE_PRODUCTS.some(
              (product) => product.id === entry.id && product.available,
            ),
          ),
        custom: saved.custom,
      };
    }
  } catch {
    // Storage unavailable or corrupted — start with an empty cart.
  }

  return EMPTY_CART;
}

function App() {
  // "home" | "shop" | "custom" | "events" | "cart"
  const [view, setView] = useState("home");
  const [cart, setCart] = useState(loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Storage unavailable — the cart still works for this visit.
    }
  }, [cart]);

  const cartCount = [...cart.readyMade, ...cart.custom].reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  function navigate(nextView) {
    setView(nextView);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function addReadyMade(id, quantity) {
    setCart((previous) => ({
      ...previous,
      readyMade: [...previous.readyMade, { id, quantity }],
    }));
  }

  function removeReadyMade(id) {
    setCart((previous) => ({
      ...previous,
      readyMade: previous.readyMade.filter((entry) => entry.id !== id),
    }));
  }

  function setReadyMadeQuantity(id, quantity) {
    setCart((previous) => ({
      ...previous,
      readyMade: previous.readyMade.map((entry) =>
        entry.id === id ? { ...entry, quantity } : entry,
      ),
    }));
  }

  function setCustomQuantity(cartId, quantity) {
    setCart((previous) => ({
      ...previous,
      custom: previous.custom.map((piece) =>
        piece.cartId === cartId ? { ...piece, quantity } : piece,
      ),
    }));
  }

  function addCustomPieces(pieces) {
    setCart((previous) => ({
      ...previous,
      custom: [...previous.custom, ...pieces],
    }));

    navigate("cart");
  }

  function removeCustomPiece(cartId) {
    setCart((previous) => ({
      ...previous,
      custom: previous.custom.filter((piece) => piece.cartId !== cartId),
    }));
  }

  function clearCart() {
    setCart(EMPTY_CART);
  }

  return (
    <div className="app-shell">
      <SiteHeader view={view} cartCount={cartCount} onNavigate={navigate} />

      <div className="app-main">
        {view === "home" && <HomePage onNavigate={navigate} />}

        {view === "shop" && (
          <ShopPage
            cartItems={cart.readyMade}
            onAdd={addReadyMade}
            onRemove={removeReadyMade}
            onChangeQuantity={setReadyMadeQuantity}
          />
        )}

        {view === "custom" && (
          <OrderPage
            onAddToCart={addCustomPieces}
            onCancel={() => navigate("home")}
          />
        )}

        {view === "events" && <EventPage onNavigate={navigate} />}

        {view === "cart" && (
          <CartPage
            cart={cart}
            onRemoveReadyMade={removeReadyMade}
            onRemoveCustom={removeCustomPiece}
            onChangeReadyMadeQuantity={setReadyMadeQuantity}
            onChangeCustomQuantity={setCustomQuantity}
            onClear={clearCart}
            onNavigate={navigate}
          />
        )}

        <footer className="site-footer">
          <div className="site-footer-inner">
            <span className="footer-wordmark">Bead and Bloom</span>
            <span>Handmade beaded jewelry</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
