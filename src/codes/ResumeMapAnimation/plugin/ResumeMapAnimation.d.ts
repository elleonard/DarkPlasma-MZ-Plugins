/// <reference path="../../../typings/rmmz.d.ts" />

type AnimationStateBase = {
  targets: Game_Character[] | Game_BattlerBase[];
  animationId: number;
  mirror: boolean;
};

type AnimationStateMZ = AnimationStateBase & {
  effect: EffekseerEffect | null;
  frameIndex: number;
};

type AnimationStateMV = AnimationStateBase & {
  remainingDuration: number;
};

type AnimationState = AnimationStateMZ | AnimationStateMV;

declare interface Sprite_Animation {
  animationState(): AnimationStateMZ | null;
  resumeAnimation(state: AnimationStateMZ): void;
}

declare interface Sprite_AnimationMV {
  animationState(): AnimationStateMV | null;
  resumeAnimation(state: AnimationStateMV): void;
}

declare interface Spriteset_Map {
  saveAnimationStates(): AnimationState[];
  restoreAnimationStates(states: AnimationState[]): void;
}
