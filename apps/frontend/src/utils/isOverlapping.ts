// utils/overlap.ts
export function isOverlapping(startA: Date, endA: Date, startB: Date, endB: Date): boolean {
  return (startA >= startB && startA < endB) || (endA > startB && endA <= endB) || (startA <= startB && endA >= endB);
}
