export const sparamSymbol = ["tgr", "grd", "rec", "pha", "mcr", "tcr", "mdr", "fdr", "exr"] as const;
export type SParamSymbol = (typeof sparamSymbol)[number];
export function symbolToSParamId(symbol: SParamSymbol): number {
  return sparamSymbol.indexOf(symbol);
}
