/**
 * The house line icons: 24-unit paths drawn for a 1.75 stroke with square caps
 * and mitred joins. Icon.astro renders them in the interface; the passport
 * stamps reuse them as emblems.
 */
export const ICONS = {
  mail: "M3.5 6.5h17v11h-17Zm0 .5 8.5 6.5L20.5 7",
  left: "M14.5 6 8.5 12l6 6",
  right: "m9.5 6 6 6-6 6",
  print: "M7 9V3.5h10V9M7 17H4.5V9h15v8H17M7 14h10v6.5H7Z",
  external: "M9 6h9v9M18 6 7 17",
  close: "M6 6l12 12M18 6 6 18",
  light: "M12 3v3M5.6 5.6l2.1 2.1M18.4 5.6l-2.1 2.1M7.5 14a4.5 4.5 0 1 1 9 0c0 1.9-1.3 2.8-1.8 4.5h-5.4C8.8 16.8 7.5 15.9 7.5 14ZM9.5 21h5",
  look: "M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12ZM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z",
  rooms: "M3 5.5h18v13H3ZM12 5.5V10M12 14v4.5",
  frame: "M4 4h16v16H4ZM8 8h8v8H8Z",
  checklist: "M5.5 3h13v18h-13ZM8.5 8h7M8.5 12h7M8.5 16h4",
  installing: "M12 3.5 5 11M12 3.5l7 7.5M5 11h14v9.5H5Z",
} as const;

export type IconName = keyof typeof ICONS;
