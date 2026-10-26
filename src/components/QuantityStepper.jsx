const MAX_QUANTITY = 20;

function QuantityStepper({ value, onChange, label = "Quantity" }) {
  return (
    <div className="quantity-stepper" role="group" aria-label={label}>
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        aria-label="Decrease quantity"
      >
        −
      </button>

      <span aria-live="polite">{value}</span>

      <button
        type="button"
        onClick={() => onChange(Math.min(MAX_QUANTITY, value + 1))}
        disabled={value >= MAX_QUANTITY}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}

export default QuantityStepper;
