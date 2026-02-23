/// <reference path="../../../typings/rmmz.d.ts" />

type UsableCountInBattle = {
  type: "number" | "variable";
  value: number;
  usableCount: () => number;
};

declare namespace MZ {
  interface Item {
    usableCountInBattle?: UsableCountInBattle;
  }

  interface Skill {
    usableCountInBattle?: UsableCountInBattle;
  }
}

declare interface BattleManager {
  _itemUseCountTable: {[key: string]: number};
  incrementUseCount(item: MZ.Item | MZ.Key): void;
  isUsableCountOk(item: MZ.Item | MZ.Skill): boolean;
  useCountKey(item: MZ.Item | MZ.Skill): string;
  useCount(item: MZ.Item | MZ.Skill): number;
}

declare namespace DataManager {
  function extractUsableCountInBattle(data: MZ.Item|MZ.Skill): UsableCountInBattle;
}

declare interface Game_BattlerBase {
}
