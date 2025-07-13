/// <reference path="../../../typings/rmmz.d.ts" />

type ChangePartyProcess = "fadeOut" | "fadeIn" | "transfer" | "commonEvent";
type ChangePartyQueue = ChangePartyProcess[];

declare interface Game_Temp {
  _changePartyQueue: ChangePartyQueue;

  dequeueChangePartyProcess(): ChangePartyProcess|undefined;
  enqueueChangePartyProcess(process: ChangePartyProcess): void;
}

declare interface Game_Screen {
  isFadeBusy(): boolean;
}

type Game_DevidedParties = {
  parties: Game_DevidedParty[];
  currentIndex: number;
};

type ChangePartyParameter = {
  autoFadeOut: boolean;
  autoFadeIn: boolean;
};

declare interface Game_Party {
  _devidedParties: Game_DevidedParties | undefined;

  devidePartyInto(devidedParties: Game_DevidedParties): void;
  devidedParties(): Game_DevidedParties | undefined;
  devidedParty(index: number): Game_DevidedParty | undefined;
  currentParty(): Game_DevidedParty | undefined;
  currentPartyIndex(): number | undefined;
  changeToNextParty(param: ChangePartyParameter): void;
  changeToPreviousParty(param: ChangePartyParameter): void;
  joinAllDevidedParties(): void;
  isDevided(): boolean;
  onPartyChanged(param: ChangePartyParameter): void;
}

type Game_DevidedPartyPosition = {
  mapId: number;
  x: number;
  y: number;
  direction: number;
};

declare interface Game_DevidedParty {
  _members: (Game_Actor|undefined)[];
  _position: Game_DevidedPartyPosition;

  readonly position: Game_DevidedPartyPosition;

  setPosition(position: Game_DevidedPartyPosition): void;
  updatePosition(): void;
  addMember(actor: Game_Actor): void;
  setMember(actor: Game_Actor|undefined, index: number): void;
  removeMember(actor: Game_Actor): void;
  includesActor(actor: Game_Actor): boolean;
  actor(index: number): Game_Actor|undefined;
  leader(): Game_Actor|undefined;
  allMembers(): Game_Actor[];
  allMembersWithSpace(): (Game_Actor|undefined)[];
  transferTo(fadeType: number): void;
  swapOrder(index1: number, index2: number): void;
  isValid(): boolean;
}

declare interface Scene_Map {
  _changePartyProcess: ChangePartyProcess|undefined;

  updateCallChangeParty(): void;
  updateChangePartyQueue(): void;
  isChangePartyEnabled(): boolean;
  isChangeToNextPartyCalled(): boolean;
  isChangeToPreviousPartyCalled(): boolean;

  isChangePartyProcessBusy(): boolean;
}
