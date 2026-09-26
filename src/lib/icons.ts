/**
 * The interface's line icons: 24-unit paths drawn for a 1.5 stroke with round
 * caps, the weight of the disk's etched rings.
 */
export const ICONS = {
  mail: "M3.5 6.5h17v11h-17Zm0 .5 8.5 6.5L20.5 7",
  left: "M14.5 6 8.5 12l6 6",
  print: "M7 9V3.5h10V9M7 17H4.5V9h15v8H17M7 14h10v6.5H7Z",
  external: "M9 6h9v9M18 6 7 17",
  close: "M6 6l12 12M18 6 6 18",
  /** A ring with its hole: the orbit glyph on the primary action. */
  orbit: "M12 3.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17ZM12 9.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z",
  /** A spiral inward: the replay of the fall. */
  fall: "M12 20.5a8.5 8.5 0 1 1 8.5-8.5c0 3.9-2.9 6.5-6.2 6.5-3 0-5.3-2.3-5.3-5.1 0-2.5 1.9-4.4 4.3-4.4 2 0 3.5 1.5 3.5 3.3 0 1.4-1 2.4-2.3 2.4",
} as const;

export type IconName = keyof typeof ICONS;
