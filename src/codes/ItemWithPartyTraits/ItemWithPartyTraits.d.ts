/// <reference path="../../typings/rmmz.d.ts" />

declare interface Game_Party {
  itemsWithPartyTrait(): MZ.Item[];
}

declare interface Game_Actor {
  traitObjectsByItem(): {traits: MZ.Trait[]}[];
}
