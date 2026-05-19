// DarkPlasma_ResumeMapAnimation 1.0.0
// Copyright (c) 2026 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2026/05/19 1.0.0 最初のバージョン
 */

/*:
 * @plugindesc マップシーンに戻った時にアニメーションを再開する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: 1.0.0
 *
 * マップシーンから他のシーン（メニュー・ショップ・戦闘など）に移行し、
 * マップシーンに戻った時、移行前に再生中だったアニメーションを再開します。
 *
 * マップ移動（場所移動）による場面転換では再開しません。
 *
 * MZスタイル・MVスタイルともに中断した位置から再開します。
 * あくまで再生位置ベースの再開であるため、
 * ランダム性のあるeffekseerアニメーションについて、
 * 再開前と全く同じ画面から再開するわけではありません。
 *
 */

(() => {
  'use strict';

  let savedAnimationStates = [];
  function Sprite_Animation_ResumeMapAnimationMixIn(spriteAnimation) {
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
  function Sprite_AnimationMV_ResumeMapAnimationMixIn(spriteAnimationMV) {
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
  function Spriteset_Map_ResumeMapAnimationMixIn(spritesetMap) {
    spritesetMap.saveAnimationStates = function () {
      return this._animationSprites.map((sprite) => sprite.animationState()).filter((state) => state !== null);
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
  function Scene_Map_ResumeMapAnimationMixIn(sceneMap) {
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
})();
