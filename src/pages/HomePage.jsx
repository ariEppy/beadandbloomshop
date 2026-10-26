import eventsPhoto from "../assets/photos/events.jpeg";
import heroPhoto from "../assets/photos/hero-beading.png";

function HomePage({ onNavigate }) {
  return (
    <main className="page">
      <section className="hero">
        <div className="hero-text">
          <h1>Handmade beaded jewelry</h1>

          <p className="lede">
            Necklaces, bracelets, anklets and earrings, made in small batches.
            Pick a finished piece, or design one that's entirely yours.
          </p>

          <div className="hero-actions">
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

        <div className="hero-image">
          <img
            src={heroPhoto}
            alt="Stringing a turquoise beaded necklace at a bead bar table"
          />
        </div>
      </section>

      <section className="home-section events-banner">
        <div className="events-banner-image">
          <img src={eventsPhoto} alt="" />
        </div>

        <div className="events-banner-text">
          <span className="eyebrow">Events</span>
          <h2>Book us for your event</h2>
          <p className="lede">
            Birthdays, showers, bat mitzvahs, team days. There are two ways we
            can be part of it:
          </p>

          <ul className="service-list">
            <li>
              <span className="service-title">Bead bar</span>
              <span className="service-text">
                We bring everything to your event and your guests make their own
                jewelry.
              </span>
            </li>

            <li>
              <span className="service-title">Party favors</span>
              <span className="service-text">
                We make handmade pieces ahead of time for you to give your
                guests.
              </span>
            </li>
          </ul>

          <button
            type="button"
            className="primary-button"
            onClick={() => onNavigate("events")}
          >
            Plan your event
          </button>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
