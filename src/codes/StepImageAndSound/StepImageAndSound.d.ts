/// <reference path="../../typings/rmmz.d.ts" />

declare namespace MZ {
  declare interface Tileset {
    stepImageSetting: StepImageSetting[];
    stepSoundSetting: StepSoundSetting[];
  }
}

declare interface Game_Temp {
  _stepImageRequests: StepImageRequest[];

  requestStepImage(request: StepImageRequest): void;
  fetchRequestStepImage(): StepImageRequest|undefined;
  isStepImageRequested(): boolean;
}

declare interface Game_CharacterBase {
  _stepCount: number;
  _wet: number;
  _wetStepCount: number;
  _moveCount: number;

  updateStepImageAndSound(): void;
  setStepWet(wet: number): void;
  clearStepWet(): void;
  isWetStep(): boolean;
  stepCount(): number;
  increaseStepCount(): void;
  stepSpeed(): number;

  StepSeVolumeRate(): number;

  isStepImageAndSoundEnabled(): boolean;
}

declare interface Game_Map {
  processStepImageAndSound(character: Game_CharacterBase): void;
}

declare interface Spriteset_Map {
  _stepSprites: Sprite_StepAnimation[];
  _stepContainer: Sprite;
  createStepContainer(): void;
  updateStepSprites(): void;
}
