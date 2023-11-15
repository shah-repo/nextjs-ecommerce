export function formatCurrency(price: Number) {
  return price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}
