/// <reference path="../../../typings/rmmz.d.ts" />

type ChangeImageWith = {
  direction: number;
  pattern: number;
  fixPattern: boolean;
};

declare interface Game_Character {
  _changeImageWith: ChangeImageWith;
  _isPatternFixed: boolean;

  setChangeImageWith(changeImageWith: ChangeImageWith): void;
  setChangeImageWithDirection(direction: number): void;
  setChangeImageWithPattern(pattern: number): void;
  setChangeImageWithFixPattern(fixPattern: boolean): void;

  isPatternFixed(): boolean;
  fixPattern(): void;
  unfixPattern(): void;
}