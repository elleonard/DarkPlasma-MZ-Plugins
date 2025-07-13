// DarkPlasma_SelectActorCharacterWindow 1.1.0
// Copyright (c) 2025 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2025/07/13 1.1.0 背の高いキャラグラを利用しているかどうかのインターフェースを追加
 * 2025/07/12 1.0.0 公開
 */

/*:
 * @plugindesc アクターの歩行グラフィックを表示して選択するウィンドウ
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param characterWidth
 * @text キャラグラの横サイズ
 * @type number
 * @default 48
 *
 * @param characterHeight
 * @text キャラグラの縦サイズ
 * @type number
 * @default 48
 *
 * @param characterDirectionToLeft
 * @desc キャラクターグラフィックを左向きで表示するかどうか
 * @text キャラグラ左向き
 * @type boolean
 * @default true
 *
 * @help
 * version: 1.1.0
 *
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    characterWidth: Number(pluginParameters.characterWidth || 48),
    characterHeight: Number(pluginParameters.characterHeight || 48),
    characterDirectionToLeft: String(pluginParameters.characterDirectionToLeft || true) === 'true',
  };

  function Scene_SelectActorCharacterMixIn(sceneClass) {
    sceneClass.characterSize = function () {
      return {
        width: settings.characterWidth,
        height: settings.characterHeight,
      };
    };
    sceneClass.defaultCharacterSize = function () {
      return {
        width: 48,
        height: 48,
      };
    };
    sceneClass.useTallCharacter = function () {
      return this.characterSize().height > this.defaultCharacterSize().height;
    };
  }
  class Window_SelectActorCharacter extends Window_StatusBase {
    initialize(rect) {
      super.initialize(rect);
      this._pendingIndex = -1;
      this.refresh();
    }
    setActivateByHover(func) {
      this._activateByHover = func;
    }
    drawActorCharacter(actor, x, y) {
      super.drawActorCharacter(actor, x, y);
      const bitmap = ImageManager.loadCharacter(actor.characterName());
      if (!bitmap.isReady()) {
        bitmap.addLoadListener(() => this.refresh());
      }
    }
    drawActorCharacterLeft(actor, x, y) {
      const bitmap = ImageManager.loadCharacter(actor.characterName());
      const big = ImageManager.isBigCharacter(actor.characterName());
      const pw = bitmap.width / (big ? 3 : 12);
      const ph = bitmap.height / (big ? 4 : 8);
      const n = big ? 0 : actor.characterIndex();
      const sx = ((n % 4) * 3 + 1) * pw;
      const sy = (Math.floor(n / 4) * 4 + 1) * ph;
      this.contents.blt(bitmap, sx, sy, pw, ph, x - pw / 2, y - ph);
      if (!bitmap.isReady()) {
        bitmap.addLoadListener(() => this.refresh());
      }
    }
    currentActor() {
      return this.actor(this.index());
    }
    pendingActor() {
      return this._pendingIndex < 0 ? undefined : this.actor(this._pendingIndex);
    }
    actor(index) {
      return this.members()[index];
    }
    members() {
      return [];
    }
    maxItems() {
      return this.members().length;
    }
    spacing() {
      return 12;
    }
    characterSize() {
      return {
        width: settings.characterWidth,
        height: settings.characterHeight,
      };
    }
    defaultCharacterSize() {
      return {
        width: 48,
        height: 48,
      };
    }
    useTallCharacter() {
      return this.characterSize().height > this.defaultCharacterSize().height;
    }
    /**
     * カーソル矩形のXオフセット
     * MZデフォサイズ(48)の場合は待機メンバーウィンドウのみ、いい感じに左右パディングが必要
     */
    rectangleOffsetX() {
      return 0;
    }
    /**
     * 歩行グラフィック表示Yオフセット
     */
    characterOffsetY() {
      return 4;
    }
    itemHeight() {
      return settings.characterHeight + this.spacing();
    }
    maxColsForRect() {
      return this.maxCols();
    }
    /**
     * スクロール高さ制限のため
     */
    overallHeight() {
      return this.maxRows() * this.itemHeight();
    }
    itemRect(index) {
      const x = this.rectangleOffsetX() + (index % this.maxColsForRect()) * this.itemWidth() - this.scrollBaseX();
      const y = Math.floor(index / this.maxColsForRect()) * this.itemHeight() - this.scrollBaseY();
      return new Rectangle(x, y, settings.characterWidth, this.itemHeight());
    }
    pendingIndex() {
      return this._pendingIndex;
    }
    setPendingIndex(pendingIndex) {
      if (this._pendingIndex !== pendingIndex) {
        this._pendingIndex = pendingIndex ?? this.index();
        this.refresh();
      }
    }
    drawAllItems() {
      this.drawPendingItemBackGround();
      this.members().forEach((actor, i) => {
        const rect = this.itemRect(i);
        const x = rect.x + settings.characterWidth / 2;
        const y = rect.y + settings.characterHeight + this.characterOffsetY();
        if (!actor) {
          return;
        }
        if (settings.characterDirectionToLeft) {
          this.drawActorCharacterLeft(actor, x, y);
        } else {
          this.drawActorCharacter(actor, x, y);
        }
      });
    }
    drawPendingItemBackGround() {
      if (this._pendingIndex >= 0) {
        const rect = this.itemRect(this._pendingIndex);
        const color = ColorManager.pendingColor();
        this.changePaintOpacity(false);
        this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
        this.changePaintOpacity(true);
      }
    }
    refreshCursor() {
      /**
       * アクティブでない場合には選択カーソル非表示
       */
      if (!this.active) {
        this.setCursorRect(0, 0, 0, 0);
      } else {
        super.refreshCursor();
      }
    }
    processCancel() {
      if (this.processCancelEnabled()) {
        super.processCancel();
      } else {
        this.playBuzzerSound();
      }
    }
    processCancelEnabled() {
      if (this.pendingIndex() >= 0) {
        return true;
      }
      if ($gameParty.forwardMembersAreAllDead) {
        return !$gameParty.forwardMembersAreAllDead();
      }
      return !$gameParty.isAllDead();
    }
    processTouch() {
      if (!this.active && this.visible && TouchInput.isHovered() && this.hitIndex() >= 0 && this._activateByHover) {
        this._activateByHover();
      }
      super.processTouch();
    }
  }
  globalThis.Scene_SelectActorCharacterMixIn = Scene_SelectActorCharacterMixIn;
  globalThis.Window_SelectActorCharacter = Window_SelectActorCharacter;
})();
