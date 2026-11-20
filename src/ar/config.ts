// Scene-composition configuration for the four Modul 10 models.
//
// Values are derived from the real bounding boxes of the GLB files (measured from the accessors +
// node transforms; all four are Y-up and used as authored, so no orientation fix is needed):
//
//   CPU_Processor.glb            0.0873 × 0.0044 × 0.0495
//   Circuit_Board.glb            0.0925 × 0.0181 × 0.0600
//   RP2040_Microcontroller.glb   0.0460 × 0.0043 × 0.0200
//   Server_Rack.glb              0.6000 × 2.0006 × 1.0653   (upright, tallest side = height)
//
// `targetSize` is the longest side after normalisation. The rack is a different real-world scale
// (a cabinet, not a chip), so each model is normalised on its own, as in Modul 8.
//
// Arrangement (reads left → right as CPU → Circuit Board → RP2040 → Server Rack): CPU and RP2040
// at the back, circuit board in front-left, and the upright rack on the right. All footprints are
// separated in x or z, so nothing overlaps.

export interface ModelLayout {
  /** Display name used for the hotspot label and the top navigation. */
  label: string;
  /** Accent colour for dot, label, leader line and info panel. */
  color: string;
  /** Longest side after orientation correction, in scene units. */
  targetSize: number;
  /** (x, z) of the model centre in the arrangement, before the arrangement is re-centred. */
  cell: [number, number];
  /** Extra rotation about X applied before measuring (radians). */
  rotateX?: number;
}

export const MODEL_LAYOUT: Record<string, ModelLayout> = {
  cpu: {
    label: "CPU",
    color: "#38bdf8",
    targetSize: 2.4,
    cell: [-2.4, -1.6],
  },
  "circuit-board": {
    label: "PAPAN SIRKUIT",
    color: "#34d399",
    targetSize: 2.9,
    cell: [-1.5, 1.6],
  },
  rp2040: {
    label: "RP2040",
    color: "#a78bfa",
    targetSize: 1.9,
    cell: [1.4, 2.1],
  },
  "server-rack": {
    label: "SERVER RACK",
    color: "#fb923c",
    targetSize: 3.0,
    cell: [3.4, 0.2],
  },
};

/** Tilted "table seen from above" orientation of the whole arrangement in the preview. */
export const HOME_EULER = { x: 0.62, y: -0.42, order: "YXZ" as const };

/** Opacity factor of the models that are not selected (they stay visible). */
export const DIM_OPACITY = 0.35;

/** Per-model manual zoom limits (relative to the model's home scale) and step per click. */
export const PART_SCALE_MIN = 0.25;
export const PART_SCALE_MAX = 4;
export const ZOOM_STEP = 1.15;
