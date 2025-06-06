/// <reference path="../../../typings/rmmz.d.ts" />

type Game_DevidedParties = {
  parties: Game_DevidedParty[];
  currentIndex: number;
};

declare interface Game_Party {
  _devidedParties: Game_DevidedParties | undefined;

  devidePartyInto(devidedParties: Game_DevidedParties): void;
  devidedParties(): Game_DevidedParties | undefined;
  devidedParty(index: number): Game_DevidedParty | undefined;
  currentParty(): Game_DevidedParty | undefined;
  currentPartyIndex(): number | undefined;
  changeToNextParty(): void;
  changeToPreviousParty(): void;
  joinAllDevidedParties(): void;
  isDevided(): boolean;
  onPartyChanged(): void;
}

type Game_DevidedPartyPosition = {
  mapId: number;
  x: number;
  y: number;
  direction: number;
};

declare interface Game_DevidedParty {
  _members: Game_Actor[];
  _position: Game_DevidedPartyPosition;

  position: Game_DevidedPartyPosition;

  setPosition(position: Game_DevidedPartyPosition): void;
  updatePosition(): void;
  addMember(actor: Game_Actor): void;
  removeMember(actor: Game_Actor): void;
  includesActor(actor: Game_Actor): boolean;
  actor(index: number): Game_Actor;
  leader(): Game_Actor;
  allMembers(): Game_Actor[];
  transferTo(fadeType: number): void;
  swapOrder(index1: number, index2: number): void;
}

declare interface Scene_Map {
  updateCallChangeParty(): void;
  isChangePartyEnabled(): boolean;
  isChangeToNextPartyCalled(): boolean;
  isChangeToPreviousPartyCalled(): boolean;
}
