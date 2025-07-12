/// <reference path="./SelectActorCharacterWindow.d.ts" />

import { settings } from '../config/_build/DarkPlasma_SelectActorCharacterWindow_parameters';

function Scene_SelectActorCharacterMixIn(sceneClass: Scene_Base) {
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
}

class Window_SelectActorCharacter extends Window_StatusBase {
  _pendingIndex: number;

  _activateByHover: () => void;

  initialize(rect: Rectangle) {
    super.initialize(rect);
    this._pendingIndex = -1;
    this.refresh();
  }

  setActivateByHover(func: () => void) {
    this._activateByHover = func;
  }

  drawActorCharacter(actor: Game_Actor, x: number, y: number) {
    super.drawActorCharacter(actor, x, y);
    const bitmap = ImageManager.loadCharacter(actor.characterName());
    if (!bitmap.isReady()) {
      bitmap.addLoadListener(() => this.refresh());
    }
  }

  drawActorCharacterLeft(actor: Game_Actor, x: number, y: number) {
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

  currentActor(): Game_Actor | undefined {
    return this.actor(this.index());
  }

  pendingActor(): Game_Actor | undefined {
    return this._pendingIndex < 0 ? undefined : this.actor(this._pendingIndex);
  }

  actor(index: number): Game_Actor | undefined {
    return this.members()[index];
  }

  members(): Game_Actor[] {
    return [];
  }

  public maxItems(): number {
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
  public overallHeight(): number {
    return this.maxRows() * this.itemHeight();
  }

  itemRect(index: number) {
    const x = this.rectangleOffsetX() + (index % this.maxColsForRect()) * this.itemWidth() - this.scrollBaseX();
    const y = Math.floor(index / this.maxColsForRect()) * this.itemHeight() - this.scrollBaseY();
    return new Rectangle(x, y, settings.characterWidth, this.itemHeight());
  }

  pendingIndex() {
    return this._pendingIndex;
  }

  setPendingIndex(pendingIndex?: number) {
    if (this._pendingIndex !== pendingIndex) {
      this._pendingIndex = pendingIndex ?? this.index();
      this.refresh();
    }
  }

  public drawAllItems(): void {
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

  public refreshCursor(): void {
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

  public processTouch(): void {
    if (!this.active && this.visible && TouchInput.isHovered() && this.hitIndex() >= 0 && this._activateByHover) {
      this._activateByHover();
    }
    super.processTouch();
  }
}

type _Window_SelectActorCharacter = typeof Window_SelectActorCharacter;
declare global {
  function Scene_SelectActorCharacterMixIn(sceneClass: Scene_Base): void;
  var Window_SelectActorCharacter: _Window_SelectActorCharacter;
}
globalThis.Scene_SelectActorCharacterMixIn = Scene_SelectActorCharacterMixIn;
globalThis.Window_SelectActorCharacter = Window_SelectActorCharacter;
