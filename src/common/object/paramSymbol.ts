export const paramSymbol = ["mhp", "mmp", "atk", "def", "mat", "mdf", "agi", "luk"] as const;
export type ParamSymbol = (typeof paramSymbol)[number];
export function symbolToParamId(symbol: ParamSymbol): number {
  return paramSymbol.indexOf(symbol);
}
