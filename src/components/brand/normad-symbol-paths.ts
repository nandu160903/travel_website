/** Shared geometry for Normad emblem (viewBox 0 0 100 100) */

/** Ivory structural N — left stem, diagonal band, right stem */
export const NORMAD_N_IVORY = [
  "M 13 88 V 14 Q 13 10 17 10 H 27 Q 31 10 31 14 V 88 Q 31 92 27 92 H 17 Q 13 92 13 88 Z",
  "M 69 88 V 14 Q 69 10 73 10 H 83 Q 87 10 87 14 V 88 Q 87 92 83 92 H 73 Q 69 92 69 88 Z",
  "M 27 90 L 39 90 L 79 10 L 67 10 Z",
].join(" ");

/** Charcoal terrain pockets inside the N */
export const NORMAD_N_CHARCOAL = [
  "M 33 16 L 66 16 L 38 84 L 33 84 Z",
  "M 62 18 L 85 18 L 85 86 L 46 86 Z",
].join(" ");

/** Winding route through the diagonal valley */
export const NORMAD_ROUTE =
  "M 22 74 C 34 62 42 54 50 48 C 58 42 64 34 70 26";

/** Subtle topographic contours (clipped to charcoal) */
export const NORMAD_TOPO_LINES = [
  "M 36 72 Q 48 58 56 50",
  "M 38 60 Q 50 46 58 40",
  "M 40 48 Q 48 40 54 34",
  "M 42 36 Q 50 28 58 24",
  "M 52 78 Q 62 64 72 52",
  "M 58 68 Q 68 54 78 40",
];

export const NORMAD_PIN = {
  drop: "M 70 21 C 70 17 74 14 74 14 C 74 14 78 17 78 21 C 78 25 74 28 74 28 C 74 28 70 25 70 21 Z",
  dot: { cx: 74, cy: 20, r: 1.6 },
};
