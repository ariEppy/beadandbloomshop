import { useEffect, useState } from "react";
import logo from "../assets/logo.png";

const NAV_LINKS = [
  { view: "shop", label: "Shop" },
  { view: "custom", label: "Custom" },
  { view: "events", label: "Events" },
];

// Must match the breakpoint in App.css where the side menu becomes a drawer.
const DESKTOP_QUERY = "(min-width: 881px)";

// Side menu on computers; on phones a top bar whose ☰ button slides the same
// menu out as a drawer.
function SiteHeader({ view, cartCount, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) {
      return undefined;
    }

    function closeOnEscape(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    // The drawer doesn't exist on desktop, so close it if the window grows.
    const desktop = window.matchMedia(DESKTOP_QUERY);

    function closeOnDesktop(event) {
      if (event.matches) {
        setMenuOpen(false);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    desktop.addEventListener("change", closeOnDesktop);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [menuOpen]);

  function go(nextView) {
    setMenuOpen(false);
    onNavigate(nextView);
  }

  function navLink(linkView, children) {
    return (
      <button
        type="button"
        key={linkView}
        className={`nav-link ${view === linkView ? "active" : ""}`}
        aria-current={view === linkView ? "page" : undefined}
        onClick={() => go(linkView)}
      >
        {children}
      </button>
    );
  }

  return (
    <>
      <div className="mobile-bar">
        <button
          type="button"
          className="icon-button"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          onClick={() => setMenuOpen(true)}
        >
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>

        <button
          type="button"
          className="mobile-logo"
          onClick={() => go("home")}
          aria-label="Bead & Bloom — home"
        >
          <img src={logo} alt="Bead & Bloom" />
        </button>

        <button
          type="button"
          className="icon-button mobile-cart"
          onClick={() => go("cart")}
          aria-label={`Cart, ${cartCount} ${cartCount === 1 ? "piece" : "pieces"}`}
        >
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 8h14l-1.2 12H6.2L5 8Z" />
            <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
          </svg>

          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </button>
      </div>

      <div
        className={`menu-backdrop ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      <aside id="site-menu" className={`sidebar ${menuOpen ? "open" : ""}`}>
        <button
          type="button"
          className="icon-button menu-close"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        >
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>

        <button
          type="button"
          className="sidebar-logo"
          onClick={() => go("home")}
          aria-label="Bead & Bloom — home"
        >
          <img src={logo} alt="Bead & Bloom" />
        </button>

        <nav className="sidebar-nav">
          {NAV_LINKS.map((link) => navLink(link.view, link.label))}

          {navLink(
            "cart",
            <>
              Cart
              <span className={`cart-count ${cartCount === 0 ? "empty" : ""}`}>
                {cartCount}
              </span>
            </>,
          )}
        </nav>

        <p className="sidebar-tagline">Handmade beaded jewelry</p>
      </aside>
    </>
  );
}

export default SiteHeader;
