// DarkPlasma_DevidePartyScene 1.1.0
// Copyright (c) 2025 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2025/07/12 1.1.0 ヘルプテキスト設定を追加
 *                  背景をぼかす
 *            1.0.0 公開
 */

/*:
 * @plugindesc パーティ分割シーン
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_ConcurrentParty
 * @base DarkPlasma_SelectActorCharacterWindow
 * @orderAfter DarkPlasma_SelectActorCharacterWindow
 *
 * @param showHelpWindow
 * @text ヘルプウィンドウを表示
 * @type boolean
 * @default true
 *
 * @param helpText
 * @desc ヘルプウィンドウに表示するテキストを設定します。
 * @text ヘルプ
 * @type multiline_string
 *
 * @command open
 * @text パーティ分割シーンを開く
 * @arg count
 * @desc 分割後のパーティ数
 * @text パーティ数
 * @type number
 * @max 3
 * @min 2
 * @default 2
 * @arg locations
 * @desc パーティごとの初期位置一覧を指定します。
 * @text 初期位置一覧
 * @type location[]
 *
 * @help
 * version: 1.1.0
 * パーティを分割するシーンを提供します。
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_ConcurrentParty version:1.1.0
 * DarkPlasma_SelectActorCharacterWindow version:1.0.0
 * 下記プラグインと共に利用する場合、それよりも下に追加してください。
 * DarkPlasma_SelectActorCharacterWindow
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    showHelpWindow: String(pluginParameters.showHelpWindow || true) === 'true',
    helpText: String(pluginParameters.helpText || ``),
  };

  function parseArgs_open(args) {
    return {
      count: Number(args.count || 2),
      locations: args.locations
        ? JSON.parse(args.locations).map((e) => {
            return (() => {
              const location = JSON.parse(e);
              return {
                mapId: Number(location.mapId),
                x: Number(location.x),
                y: Number(location.y),
              };
            })();
          })
        : [],
    };
  }

  const command_open = 'open';

  const WAITING_WINDOW_PADDING = 36;
  PluginManager.registerCommand(pluginName, command_open, function (args) {
    const parsedArgs = parseArgs_open(args);
    const locations = parsedArgs.locations.map((l) => {
      return {
        ...l,
        direction: 2,
      };
    });
    $gameTemp.setDevidePartyInfo(parsedArgs.count, locations);
    SceneManager.push(Scene_DevideParty);
  });
  function Game_Temp_DevidePartySceneMixIn(gameTemp) {
    const _initialize = gameTemp.initialize;
    gameTemp.initialize = function () {
      _initialize.call(this);
      this._devidePartyInfo = undefined;
    };
    gameTemp.devidePartyInfo = function () {
      return this._devidePartyInfo;
    };
    gameTemp.setDevidePartyInfo = function (count, locations) {
      this._devidePartyInfo = {
        count,
        locations,
      };
    };
    gameTemp.devidePartyCount = function () {
      return this._devidePartyInfo?.count || 2;
    };
    gameTemp.devidePartyLocation = function (index) {
      return (
        this._devidePartyInfo?.locations[index] || {
          mapId: 1,
          x: 0,
          y: 0,
          direction: 2,
        }
      );
    };
  }
  Game_Temp_DevidePartySceneMixIn(Game_Temp.prototype);
  class Scene_DevideParty extends Scene_Base {
    constructor() {
      super(...arguments);
      this._helpWindow = null;
      this._cancelButton = null;
    }
    create() {
      super.create();
      this.createBackground();
      this.createWindowLayer();
      this.createButtons();
      this.createHelpWindow();
      this.createStatusWindow();
      this.createWaitingMemberWindow();
      this.createDevidedPartyWindows();
    }
    createBackground() {
      this._backgroundSprite = new Sprite();
      this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
      this._backgroundSprite.filters = [new PIXI.filters.BlurFilter()];
      this.addChild(this._backgroundSprite);
    }
    createButtons() {
      if (ConfigManager.touchUI) {
        this._cancelButton = new Sprite_Button('cancel');
        this._cancelButton.x = Graphics.boxWidth - this.cancelButtonWidth() - 4;
        this._cancelButton.y = this.buttonY();
        this.addChild(this._cancelButton);
      }
    }
    cancelButtonWidth() {
      return this._cancelButton ? this._cancelButton.width : 0;
    }
    createHelpWindow() {
      this._helpWindow = new Window_Help(this.helpWindowRect());
      this._helpWindow.setText(this.helpWindowText());
      this.addWindow(this._helpWindow);
    }
    createStatusWindow() {
      this._statusWindow = new Window_DevidePartyStatus(this.statusWindowRect());
      this.addWindow(this._statusWindow);
    }
    createWaitingMemberWindow() {
      this._waitingMemberWindow = new Window_DevidePartyWaitingMember(this.waitingMemberWindowRect());
      this._waitingMemberWindow.setHandler('ok', () => this.onSelectActor(this._waitingMemberWindow));
      this._waitingMemberWindow.setHandler('cancel', () => this.onCancel(this._waitingMemberWindow));
      this._waitingMemberWindow.setStatusWindow(this._statusWindow);
      this._waitingMemberWindow.setParty(this.waitingMembers());
      this._waitingMemberWindow.refresh();
      this.addWindow(this._waitingMemberWindow);
    }
    createDevidedPartyWindows() {
      this._devidedParties = [...Array($gameTemp.devidePartyCount()).keys()].map((_) => new Game_DevidedParty());
      this._devidedPartyWindows = [...Array($gameTemp.devidePartyCount()).keys()].map(
        (i) => new Window_DevidedParty(this.devidedPartyWindowRect(i)),
      );
      this._devidedPartyWindows.forEach((w, index) => {
        w.setHandler('ok', () => this.onSelectActor(w));
        w.setHandler('cancel', () => this.onCancel(w));
        w.setWaitingMemberWindow(this._waitingMemberWindow);
        w.setStatusWindow(this._statusWindow);
        w.setPreviousWindow(
          this._devidedPartyWindows[(index + this._devidedPartyWindows.length - 1) % this._devidedPartyWindows.length],
        );
        w.setNextWindow(this._devidedPartyWindows[(index + 1) % this._devidedPartyWindows.length]);
        w.setParty(this._devidedParties[index]);
        this.addWindow(w);
      });
      this._waitingMemberWindow.setDevidedPartyWindows(this._devidedPartyWindows);
    }
    start() {
      super.start();
      this._waitingMemberWindow.activate();
      this._waitingMemberWindow.select(0);
    }
    helpWindowText() {
      return settings.helpText;
    }
    helpWindowRect() {
      if (settings.showHelpWindow) {
        const width = ConfigManager.touchUI ? Graphics.boxWidth - this.cancelButtonWidth() - 8 : Graphics.boxWidth;
        return new Rectangle(0, 0, width, this.helpAreaHeight());
      } else {
        return new Rectangle(0, 0, 0, 0);
      }
    }
    helpAreaHeight() {
      return this.calcWindowHeight(1, false);
    }
    statusWindowRect() {
      return new Rectangle(0, this.helpAreaHeight(), Graphics.boxWidth, this.calcWindowHeight(4, false));
    }
    waitingMemberWindowRect() {
      return new Rectangle(
        0,
        this.helpAreaHeight() + this.statusWindowRect().height,
        Graphics.boxWidth,
        this.memberWindowHeight(),
      );
    }
    memberWindowHeight() {
      const characterSize = this.characterSize();
      return characterSize.height > this.defaultCharacterSize().height
        ? characterSize.height + WAITING_WINDOW_PADDING
        : characterSize.height * 2 + Math.floor((WAITING_WINDOW_PADDING * 4) / 3);
    }
    devidedPartyWindowRect(index) {
      return new Rectangle(
        index * this.devidedPartyWindowWidth(),
        this.helpAreaHeight() + this.statusWindowRect().height + this.memberWindowHeight(),
        this.devidedPartyWindowWidth(),
        this.memberWindowHeight(),
      );
    }
    devidedPartyWindowWidth() {
      const characterSize = this.characterSize();
      const characterSpacing = Window_SelectActorCharacter.prototype.spacing();
      return characterSize.height > this.defaultCharacterSize().height
        ? (characterSize.width + characterSpacing) * $gameParty.maxBattleMembers()
        : (characterSize.width + characterSpacing) * Math.floor(($gameParty.maxBattleMembers() + 1) / 2) + 32;
    }
    pendingWindow() {
      return this._pendingWindow;
    }
    waitingMembers() {
      if (!this._waitingMembers) {
        this._waitingMembers = new Game_DevidedParty();
        $gameParty.allMembers().forEach((actor) => this._waitingMembers.addMember(actor));
      }
      return this._waitingMembers;
    }
    onSelectActor(currentWindow) {
      if (!this._pendingWindow) {
        /**
         * 初回選択
         */
        this._pendingWindow = currentWindow;
        this._pendingWindow.setPendingIndex();
      } else if (this._pendingWindow === currentWindow) {
        /**
         * 2回目の選択: 同一ウィンドウ内入れ替え
         */
        if (this._pendingWindow.pendingIndex() !== this._pendingWindow?.index()) {
          this._pendingWindow.party().swapOrder(this._pendingWindow.index(), this._pendingWindow.pendingIndex());
          this._pendingWindow.setPendingIndex(-1);
          this._pendingWindow.refresh();
          this._pendingWindow = undefined;
        }
      } else {
        /**
         * 2回目の選択: 別々のウィンドウ同士で入れ替え
         */
        const actor1 = this._pendingWindow.pendingActor();
        const actor2 = currentWindow.currentActor();
        if (actor1 && !actor2) {
          this._pendingWindow.party().removeMember(actor1);
          currentWindow.party().addMember(actor1);
        }
        if (actor2 && !actor1) {
          currentWindow.party().removeMember(actor2);
          this._pendingWindow.party().addMember(actor2);
        }
        if (actor1 && actor2) {
          currentWindow.party().setMember(actor1, currentWindow.index());
          this._pendingWindow.party().setMember(actor2, this._pendingWindow.pendingIndex());
        }
        this._pendingWindow.setPendingIndex(-1);
        this._pendingWindow.refresh();
        currentWindow.refresh();
        this._pendingWindow = undefined;
      }
      currentWindow.activate();
    }
    onCancel(currentWindow) {
      if (this._pendingWindow) {
        this._pendingWindow.setPendingIndex(-1);
        this._pendingWindow = undefined;
        currentWindow.activate();
      } else if (this.canCommit()) {
        this.commitDevidedPartiesAndExit();
      } else {
        currentWindow.activate();
      }
    }
    commitDevidedPartiesAndExit() {
      this._devidedParties.forEach((party, index) => party.setPosition($gameTemp.devidePartyLocation(index)));
      $gameParty.devidePartyInto({
        parties: this._devidedParties,
        currentIndex: 0,
      });
      this.popScene();
    }
    canCommit() {
      return this._devidedParties.every((party) => party.isValid());
    }
  }
  Scene_SelectActorCharacterMixIn(Scene_DevideParty.prototype);
  class Window_DevidePartyStatus extends Window_SkillStatus {
    loadFaceImages() {
      super.loadFaceImages();
      /**
       * 先頭の顔グラビットマップの読み込みが間に合わなかった時のため
       * ロード完了時にリフレッシュする
       */
      ImageManager.loadFace($gameParty.leader().faceName()).addLoadListener(() => this.refresh());
    }
    numVisibleRows() {
      return 4;
    }
    windowHeight() {
      return this.fittingHeight(this.numVisibleRows());
    }
  }
  class Window_DevidePartyMember extends Window_SelectActorCharacter {
    constructor() {
      super(...arguments);
      this._statusWindow = null;
      this._statusParamsWindow = null;
      this._equipWindow = null;
    }
    setStatusWindow(statusWindow) {
      this._statusWindow = statusWindow;
    }
    setStatusParamsWindow(statusParamsWindow) {
      this._statusParamsWindow = statusParamsWindow;
    }
    setEquipWindow(equipWindow) {
      this._equipWindow = equipWindow;
    }
    members() {
      return [];
    }
    party() {
      return new Game_DevidedParty();
    }
    nearestIndexCandidates(x, y) {
      return [...Array(this.maxItems()).keys()];
    }
    nearestIndexTo(x, y) {
      const candidates = this.nearestIndexCandidates(x, y).map((i) => {
        const rect = this.itemRect(i);
        return {
          index: i,
          x: this.x + rect.x + Math.floor(rect.width / 2),
          y: this.y + rect.y + Math.floor(rect.height / 2),
        };
      });
      return candidates.reduce((result, current) => {
        if (!result) {
          return current;
        }
        if (Math.abs(result.x - x) + Math.abs(result.y - y) > Math.abs(current.x - x) + Math.abs(result.y - y)) {
          return current;
        }
        return result;
      }, undefined).index;
    }
    activationTargetWindow() {
      return this;
    }
    activateOtherWindow(target) {
      this.deactivate();
      target.activate();
      const currentPoint = this.itemRect(this.index());
      target.select(target.nearestIndexTo(currentPoint.x + this.x, currentPoint.y + this.y));
    }
    select(index) {
      super.select(index);
      const actor = this.currentActor();
      if (this._statusWindow) {
        this._statusWindow.setActor(actor || null);
      }
      if (this._statusParamsWindow) {
        this._statusParamsWindow.setActor(actor || null);
      }
      if (this._equipWindow) {
        this._equipWindow.setActor(actor || null);
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
  }
  class Window_DevidePartyWaitingMember extends Window_DevidePartyMember {
    setDevidedPartyWindows(windows) {
      this._devidedPartyWindows = windows;
    }
    setParty(party) {
      this._party = party;
    }
    activationTargetWindow() {
      const cursorX = this.x + this.itemRect(this.index()).x;
      const targetWindowIndex = this._devidedPartyWindows.findIndex(
        (devidedPartyWindow) => devidedPartyWindow.x + devidedPartyWindow.width > cursorX,
      );
      return targetWindowIndex < 0
        ? this._devidedPartyWindows[this._devidedPartyWindows.length - 1]
        : this._devidedPartyWindows[targetWindowIndex];
    }
    maxCols() {
      return Math.floor(this.innerWidth / (this.characterSize().width + this.spacing()));
    }
    maxItems() {
      return this.maxCols() * 2;
    }
    members() {
      return this._party?.allMembers() || [];
    }
    party() {
      return this._party;
    }
    nearestIndexCandidates(x, y) {
      return super.nearestIndexCandidates(x, y).filter((i) => i >= this.maxCols());
    }
    cursorDown(wrap) {
      if (this.index() >= this.maxCols()) {
        this.activateOtherWindow(this.activationTargetWindow());
        this.playCursorSound();
        this.updateInputData();
      } else {
        super.cursorDown(wrap);
      }
    }
  }
  class Window_DevidedParty extends Window_DevidePartyMember {
    setWaitingMemberWindow(waitingMemberWindow) {
      this._waitingMemberWindow = waitingMemberWindow;
    }
    setPreviousWindow(previousWindow) {
      this._previousWindow = previousWindow;
    }
    setNextWindow(nextWindow) {
      this._nextWindow = nextWindow;
    }
    setParty(party) {
      this._party = party;
    }
    isAtTopRow() {
      return this.index() < this.maxCols();
    }
    isAtLeftEdge() {
      return this.index() % this.maxCols() === 0;
    }
    isAtRightEdge() {
      return this.index() % this.maxCols() === this.maxCols() - 1;
    }
    maxCols() {
      return this.characterSize().height > this.defaultCharacterSize().height
        ? $gameParty.maxBattleMembers()
        : Math.ceil($gameParty.maxBattleMembers() / 2);
    }
    maxItems() {
      return $gameParty.maxBattleMembers();
    }
    members() {
      return this._party?.allMembers() || [];
    }
    party() {
      return this._party;
    }
    nearestIndexCandidates(x, y) {
      return super.nearestIndexCandidates(x, y).filter((i) => i < this.maxCols());
    }
    cursorUp(wrap) {
      if (this.isAtTopRow()) {
        this.activateOtherWindow(this._waitingMemberWindow);
        this.playCursorSound();
        this.updateInputData();
      } else {
        super.cursorUp(wrap);
      }
    }
    cursorLeft(wrap) {
      if (this.isAtLeftEdge()) {
        this.activateOtherWindow(this._previousWindow);
        this.playCursorSound();
        this.updateInputData();
      } else {
        super.cursorLeft(wrap);
      }
    }
    cursorRight(wrap) {
      if (this.isAtRightEdge()) {
        this.activateOtherWindow(this._nextWindow);
        this.playCursorSound();
        this.updateInputData();
      } else {
        super.cursorRight(wrap);
      }
    }
  }
  globalThis.Scene_DevideParty = Scene_DevideParty;
})();
