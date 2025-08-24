export const xparamSymbol = ['hit', 'eva', 'cri', 'cev', 'mev', 'mrf', 'cnt', 'hrg', 'mrg', 'trg'] as const;
export type XParamSymbol = (typeof xparamSymbol)[number];
export function symbolToXParamId(symbol: XParamSymbol): number {
  return xparamSymbol.indexOf(symbol);
}
