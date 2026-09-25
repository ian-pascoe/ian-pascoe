/** Document-unique ids for seal text paths; several seals can share one page. */
let count = 0;
export function nextSealId(): string {
  count += 1;
  return `seal-${count}`;
}
