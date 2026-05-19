/// <reference path="./ResumeMapAnimation.d.ts" />

let savedAnimationStates: AnimationState[] = [];

function Sprite_Animation_ResumeMapAnimationMixIn(spriteAnimation: Sprite_Animation) {
  spriteAnimation.animationState = function () {
    if (!this._animation || !this._playing) return null;
    return {
      targets: this.targetObjects,
      animationId: this._animation.id,
      mirror: this._mirror,
      effect: this._effect,
      frameIndex: this._frameIndex,
    };
  };

  spriteAnimation.resumeAnimation = function (state) {
    if (state.effect && state.effect.isLoaded) {
      this._handle = Graphics.effekseer.play(state.effect);
      this._handle.setFrame(state.frameIndex);
      this._started = true;
      this._frameIndex = state.frameIndex;
    }
  };
}

Sprite_Animation_ResumeMapAnimationMixIn(Sprite_Animation.prototype);

function Sprite_AnimationMV_ResumeMapAnimationMixIn(spriteAnimationMV: Sprite_AnimationMV) {
  spriteAnimationMV.animationState = function () {
    if (!this._animation || !this.isPlaying()) return null;
    return {
      targets: this.targetObjects,
      animationId: this._animation.id,
      mirror: this._mirror,
      remainingDuration: this._duration,
    };
  };

  spriteAnimationMV.resumeAnimation = function (state) {
    this._duration = state.remainingDuration;
  };
}

Sprite_AnimationMV_ResumeMapAnimationMixIn(Sprite_AnimationMV.prototype);

function Spriteset_Map_ResumeMapAnimationMixIn(spritesetMap: Spriteset_Map) {
  spritesetMap.saveAnimationStates = function () {
    return this._animationSprites
      .map(sprite => sprite.animationState())
      .filter((state): state is AnimationState => state !== null);
  };

  spritesetMap.restoreAnimationStates = function (states) {
    for (const state of states) {
      const animation = $dataAnimations[state.animationId];
      if (!animation) continue;
      this.createAnimationSprite(state.targets, animation, state.mirror, 0);
      const sprite = this.lastAnimationSprite();
      if (!sprite) continue;
      if ('remainingDuration' in state) {
        if (sprite instanceof Sprite_AnimationMV) {
          sprite.resumeAnimation(state);
        }
      } else {
        if (sprite instanceof Sprite_Animation) {
          sprite.resumeAnimation(state);
        }
      }
    }
  };
}

Spriteset_Map_ResumeMapAnimationMixIn(Spriteset_Map.prototype);

function Scene_Map_ResumeMapAnimationMixIn(sceneMap: Scene_Map) {
  const _terminate = sceneMap.terminate;
  sceneMap.terminate = function () {
    if (!this._transfer && this._spriteset) {
      savedAnimationStates = this._spriteset.saveAnimationStates();
    }
    _terminate.call(this);
  };

  const _start = sceneMap.start;
  sceneMap.start = function () {
    _start.call(this);
    if (!this._transfer && savedAnimationStates.length > 0 && this._spriteset) {
      this._spriteset.restoreAnimationStates(savedAnimationStates);
    }
    savedAnimationStates = [];
  };
}

Scene_Map_ResumeMapAnimationMixIn(Scene_Map.prototype);
