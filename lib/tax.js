export function calcTax({ cart = [], tax }) {
  if (!tax?.enabled) return { taxableSubtotal: 0, taxAmount: 0 };

  const taxableSubtotal = cart.reduce((sum, item) => {
    const isTaxable = item.taxable ?? true;
    if (!isTaxable) return sum;
    return sum + Number(item.price || 0) * Number(item.quantity || 0);
  }, 0);

  let taxAmount = 0;

  if (tax.type === "percent") {
    taxAmount = taxableSubtotal * (Number(tax.value || 0) / 100);
  } else if (tax.type === "fixed") {
    taxAmount = Number(tax.value || 0);
  }

  return { taxableSubtotal, taxAmount };
}
