export const zipArray = <T extends (readonly unknown[])[]>(
  ...args: [...T]
): { [P in keyof T]: T[P][number] }[] => {
  if (!args.length) return [];
  const minLen = args.reduce((a, c) => (a.length < c.length ? a : c)).length;
  let result = [];
  for (let i = 0; i < minLen; i++) {
    result.push(args.map((arg) => arg[i]));
  }
  return result as any[];
};
