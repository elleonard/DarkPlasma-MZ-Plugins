export function orderIdSort(a, b) {
  if (a === null && b === null) {
    // 両方nullなら順不同
    return 0;
  } else if (a === null) {
    return 1;
  } else if (b === null) {
    return -1;
  }
  return (a.orderId || a.id) - (b.orderId || b.id);
}
