export type HarmonyType =
  | "complementary"
  | "analogous"
  | "triadic"
  | "split_complementary";

export type Ensemble = {
  name: HarmonyType;
  hues: number[];
};

export const ensembles: Ensemble[] = [
  {
    name: "complementary",
    hues: [0, 180],
  },
  {
    name: "analogous",
    hues: [-30, 0, 30],
  },
  {
    name: "triadic",
    hues: [0, 120, 240],
  },
  {
    name: "split_complementary",
    hues: [0, 150, 210],
  },
];
