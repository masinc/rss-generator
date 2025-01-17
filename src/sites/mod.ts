import { generate as generateNikkeiBookplus } from "./nikkei_bookplus.ts";

export const generators = [
  {
    name: "nikkei-bookplus",
    generate: generateNikkeiBookplus,
  },
];
