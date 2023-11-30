/// <reference path="./ItemWithPartyTraits.d.ts" />

function Game_Party_ItemWithPartyTraitsMixIn(gameParty: Game_Party) {
  gameParty.itemsWithPartyTrait = function () {
    return this.items().filter(item => item.meta.partyTraits);
  };
}

Game_Party_ItemWithPartyTraitsMixIn(Game_Party.prototype);

function Game_Actor_ItemWithPartyTraitsMixIn(gameActor: Game_Actor) {
  const _traitObjects = gameActor.traitObjects;
  gameActor.traitObjects = function () {
    return _traitObjects.call(this).concat(this.traitObjectsByItem());
  };

  gameActor.traitObjectsByItem = function () {
    return $gameParty.itemsWithPartyTrait().map(item => {
      const t = String(item.meta.partyTraits).split('/');
      switch (t[0]) {
        case 'actor':
          return $dataActors[Number(t[1])];
        case 'class':
          return $dataClasses[Number(t[1])];
        case 'weapon':
          return $dataWeapons[Number(t[1])];
        case 'armor':
          return $dataArmors[Number(t[1])];
        case 'state':
          return $dataStates[Number(t[1])];
        default:
          return undefined;
      }
    }).filter((object): object is MZ.Actor|MZ.Class|MZ.Weapon|MZ.Armor|MZ.State => !!object && "traits" in object);
  };
}

Game_Actor_ItemWithPartyTraitsMixIn(Game_Actor.prototype);
