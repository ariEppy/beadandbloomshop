function CustomerForm({ customer, onChange }) {
  function handleChange(event) {
    const { name, value } = event.target;

    onChange({
      [name]: value,
    });
  }

  return (
    <section className="customer-form">
      <div className="customer-fields">
        <label>
          <span className="field-label">Name</span>

          <input
            type="text"
            name="name"
            value={customer.name}
            onChange={handleChange}
            placeholder="Your name"
            required
          />
        </label>

        <label>
          <span className="field-label">Phone</span>

          <input
            type="tel"
            name="phone"
            value={customer.phone}
            onChange={handleChange}
            placeholder="Your phone number"
            required
          />
        </label>

        <label className="full-width">
          <span className="field-label">Email</span>

          <input
            type="email"
            name="email"
            value={customer.email}
            onChange={handleChange}
            placeholder="your@email.com"
            required
          />
        </label>

        <label className="full-width">
          <span className="field-label">Promo code (optional)</span>

          <input
            type="text"
            name="promoCode"
            value={customer.promoCode}
            onChange={handleChange}
            placeholder="Enter promo code"
          />
        </label>

        <label className="full-width">
          <span className="field-label">
            Anything else you'd like us to know?
          </span>

          <textarea
            name="notes"
            value={customer.notes}
            onChange={handleChange}
            placeholder="Questions, special requests, timing, or anything else..."
          />
        </label>
      </div>
    </section>
  );
}

export default CustomerForm;
