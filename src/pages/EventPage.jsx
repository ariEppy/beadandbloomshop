import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { emailErrorReason } from "../utils/emailError";
import CustomerForm from "../components/CustomerForm";
import ImageUpload from "../components/ImageUpload";
import MultiSelectDropdown from "../components/MultiSelectDropdown";
import { CHARMS, COLORS } from "../data/jewelryOptions";

const EVENT_TYPES = [
  "Birthday party",
  "Bat / Bar Mitzvah",
  "Bridal shower / Bachelorette",
  "Wedding",
  "Baby shower",
  "Company / team event",
  "School or camp",
  "Other",
];

const BOOKING_TYPES = [
  {
    value: "Bead bar",
    title: "Bead bar",
    text: "We come to your event and guests make their own jewelry.",
  },
  {
    value: "Party favors",
    title: "Party favors",
    text: "We make pieces ahead of time for you to give your guests.",
  },
  {
    value: "Not sure yet",
    title: "Not sure yet",
    text: "Let's talk it through and find what fits.",
  },
];

const AGE_GROUPS = ["Kids (under 12)", "Teens", "Adults", "Mixed ages"];

const JEWELRY_TYPES = ["Necklaces", "Bracelets", "Anklets", "Earrings"];

const SIZES = ["Kids", "Small", "Medium", "Large", "Mixed / not sure"];

const METALS = ["Gold", "Silver", "Mix of both", "No charms"];

const INITIAL_EVENT = {
  eventType: "",
  bookingType: "",
  date: "",
  time: "",
  location: "",
  guests: "",
  ages: "",
  jewelryTypes: [],
  sizes: [],
  colors: [],
  metal: "",
  charms: [],
  description: "",
  inspirationImageUrl: "",
};

const INITIAL_CUSTOMER = {
  name: "",
  phone: "",
  email: "",
  promoCode: "",
  notes: "",
};

function todayForDateInput() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${today.getFullYear()}-${month}-${day}`;
}

function EventPage({ onNavigate }) {
  const form = useRef();

  const [event, setEvent] = useState(INITIAL_EVENT);
  const [customer, setCustomer] = useState(INITIAL_CUSTOMER);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  function update(field, value) {
    setEvent((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function updateCustomer(updatedData) {
    setCustomer((previous) => ({
      ...previous,
      ...updatedData,
    }));
  }

  function createEventSummary() {
    const list = (items, fallback = "Not specified") =>
      items.length > 0 ? items.join(", ") : fallback;

    const lines = [
      "ORDER TYPE: EVENT BOOKING REQUEST",
      "",
      `Event: ${event.eventType || "Not specified"}`,
      `Looking for: ${event.bookingType || "Not specified"}`,
      `Date: ${event.date || "Not specified"}`,
      `Time: ${event.time || "Not specified"}`,
      `Location: ${event.location || "Not specified"}`,
      `Number of guests: ${event.guests || "Not specified"}`,
      `Guests' ages: ${event.ages || "Not specified"}`,
      "",
      `Jewelry: ${list(event.jewelryTypes)}`,
      `Sizes: ${list(event.sizes)}`,
      `Colors: ${list(event.colors)}`,
      `Charms: ${event.metal || "Not specified"}`,
    ];

    if (event.metal !== "No charms") {
      lines.push(`Charm themes: ${list(event.charms, "None chosen")}`);
    }

    lines.push(
      `Theme / vision: ${event.description || "No additional description"}`,
      `Inspiration Picture: ${event.inspirationImageUrl || "None uploaded"}`,
    );

    if (customer.promoCode) {
      lines.push("", `PROMO CODE: ${customer.promoCode}`);
    }

    return lines.join("\n");
  }

  async function handleSubmit(submitEvent) {
    submitEvent.preventDefault();

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
      setEvent(INITIAL_EVENT);
      setCustomer(INITIAL_CUSTOMER);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (sendError) {
      console.error("EmailJS error:", sendError);

      const reason = emailErrorReason(sendError);

      setError(
        `Something went wrong while sending your request. Please try again.${
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
          <span className="eyebrow">Request received</span>
          <h1>Thank you</h1>
          <p className="lede">
            Your event request is on its way to us. We'll get back to you soon
            to check availability and go over the details and pricing.
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

  return (
    <main className="page">
      <div className="page-intro">
        <span className="eyebrow">Events</span>
        <h1>Book an event</h1>
        <p className="lede">
          A bead bar at your party, or handmade favors for your guests. Tell us
          about your event and we'll get back to you with availability and
          pricing.
        </p>
      </div>

      <form ref={form} onSubmit={handleSubmit} className="event-form">
        <section className="form-card">
          <h2 className="section-label">The event</h2>

          <fieldset className="option-cards">
            <legend className="field-label">What are you looking for?</legend>

            {BOOKING_TYPES.map((option) => (
              <label className="option-card" key={option.value}>
                <input
                  type="radio"
                  name="event_booking_type"
                  value={option.value}
                  checked={event.bookingType === option.value}
                  onChange={() => update("bookingType", option.value)}
                  required
                />
                <span className="option-card-title">{option.title}</span>
                <span className="option-card-text">{option.text}</span>
              </label>
            ))}
          </fieldset>

          <div className="customization-fields">
            <label>
              <span className="field-label">Type of event</span>
              <select
                name="event_type"
                value={event.eventType}
                onChange={(changeEvent) =>
                  update("eventType", changeEvent.target.value)
                }
                required
              >
                <option value="">Choose one</option>
                {EVENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="field-label">Number of guests</span>
              <input
                type="number"
                name="event_guests"
                min="1"
                placeholder="About how many?"
                value={event.guests}
                onChange={(changeEvent) =>
                  update("guests", changeEvent.target.value)
                }
                required
              />
            </label>

            <label>
              <span className="field-label">Date</span>
              <input
                type="date"
                name="event_date"
                min={todayForDateInput()}
                value={event.date}
                onChange={(changeEvent) =>
                  update("date", changeEvent.target.value)
                }
                required
              />
            </label>

            <label>
              <span className="field-label">Start time (optional)</span>
              <input
                type="time"
                name="event_time"
                value={event.time}
                onChange={(changeEvent) =>
                  update("time", changeEvent.target.value)
                }
              />
            </label>

            <label className="full-width">
              <span className="field-label">Location</span>
              <input
                type="text"
                name="event_location"
                placeholder="City, venue or address"
                value={event.location}
                onChange={(changeEvent) =>
                  update("location", changeEvent.target.value)
                }
                required
              />
            </label>

            <label>
              <span className="field-label">Guests' ages</span>
              <select
                name="event_ages"
                value={event.ages}
                onChange={(changeEvent) =>
                  update("ages", changeEvent.target.value)
                }
              >
                <option value="">Choose one</option>
                {AGE_GROUPS.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="form-card">
          <h2 className="section-label">The jewelry</h2>

          <div className="customization-fields">
            <div>
              <span className="field-label">Jewelry</span>
              <MultiSelectDropdown
                label="Jewelry"
                options={JEWELRY_TYPES}
                selected={event.jewelryTypes}
                onChange={(value) => update("jewelryTypes", value)}
              />
            </div>

            <div>
              <span className="field-label">Sizes</span>
              <MultiSelectDropdown
                label="Sizes"
                options={SIZES}
                selected={event.sizes}
                onChange={(value) => update("sizes", value)}
              />
            </div>

            <div className="full-width">
              <span className="field-label">Colors</span>
              <MultiSelectDropdown
                label="Colors"
                options={COLORS}
                selected={event.colors}
                onChange={(value) => update("colors", value)}
              />
            </div>
          </div>

          <fieldset className="segmented-field">
            <legend className="field-label">Charms</legend>

            <div className="segmented">
              {METALS.map((metal) => (
                <label key={metal}>
                  <input
                    type="radio"
                    name="event_metal"
                    value={metal}
                    checked={event.metal === metal}
                    onChange={() => update("metal", metal)}
                  />
                  <span>{metal}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {event.metal !== "No charms" && (
            <div className="charm-themes">
              <span className="field-label">Charm themes</span>
              <MultiSelectDropdown
                label="Charm themes"
                options={CHARMS}
                selected={event.charms}
                onChange={(value) => update("charms", value)}
              />
            </div>
          )}

          <ImageUpload
            imageUrl={event.inspirationImageUrl}
            onUploaded={(url) => update("inspirationImageUrl", url)}
            onRemoved={() => update("inspirationImageUrl", "")}
          />

          <label className="description-field">
            <span className="field-label">Theme or vision</span>
            <span className="field-helper">
              A party theme, a color story, anything you have in mind.
            </span>
            <textarea
              name="event_description"
              placeholder="For example: a garden party in soft pinks and gold, around 20 girls aged 10–12..."
              value={event.description}
              onChange={(changeEvent) =>
                update("description", changeEvent.target.value)
              }
            />
          </label>
        </section>

        <section className="form-card">
          <h2 className="section-label">Your details</h2>
          <CustomerForm customer={customer} onChange={updateCustomer} />
        </section>

        <input
          type="hidden"
          name="order_summary"
          value={createEventSummary()}
        />

        <p className="submit-note">
          This is a request, not a booking yet. We'll get back to you to
          confirm availability, pricing and the details.
        </p>

        <div className="event-submit">
          <button type="submit" className="primary-button" disabled={sending}>
            {sending ? "Sending…" : "Send booking request"}
          </button>

          {error && <p className="form-error">{error}</p>}
        </div>
      </form>
    </main>
  );
}

export default EventPage;
