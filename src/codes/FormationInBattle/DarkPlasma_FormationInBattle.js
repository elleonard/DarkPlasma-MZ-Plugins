import { isMapMetaDataAvailable } from '../../common/mapMetaData';
import { settings } from './_build/DarkPlasma_FormationInBattle_parameters';

/**
 * 隊列変更のクールタイム
 */
class FormationCooldown {
  constructor() {
    this._cooldownTurn = 0;
    this._membersAtTurnStart = [];
  }

  /**
   * 戦闘開始時の初期化
   */
  initCooldown() {
    this._cooldownTurn = 0;
    this.storeMembersAtTurnStart();
  }

  /**
   * ターン開始時のメンバー隊列を保持する
   */
  storeMembersAtTurnStart() {
    this._membersAtTurnStart = settings.cooldownOnlyWhenSwapForwardAndBenchwarmer
      ? $gameParty.battleMembers().map((actor) => actor.actorId())
      : $gameParty.allMembers().map((actor) => actor.actorId());
  }

  /**
   * クールダウン開始の必要があるかどうか
   * @return {boolean}
   */
  needCooldown() {
    /**
     * 強制入れ替え時にクールダウンしない
     */
    if (
      !settings.cooldownWithForceFormation &&
      $gameParty.forceFormationChanged &&
      $gameParty.forceFormationChanged()
    ) {
      $gameParty.resetForceFormationChanged();
      return false;
    }
    if (settings.cooldownOnlyWhenSwapForwardAndBenchwarmer) {
      // 前衛後衛が入れ替わっている場合のみ
      const battleMembers = $gameParty.battleMembers().map((actor) => actor.actorId());
      return battleMembers.some((actorId) => {
        return !this._membersAtTurnStart.includes(actorId);
      });
    } else {
      // メンバーの順番がいずれか変わっていれば
      const members = $gameParty.allMembers().map((actor) => actor.actorId());
      return this._membersAtTurnStart.some((actorId, index) => {
        return actorId !== members[index];
      });
    }
  }

  /**
   * クールダウンが必要なら開始する
   */
  triggerCooldown() {
    if (this.needCooldown()) {
      this.startCooldown();
    }
    this.storeMembersAtTurnStart();
  }

  /**
   * クールダウン中かどうか
   * @return {boolean}
   */
  isDuringCooldown() {
    return this._cooldownTurn > 0;
  }

  startCooldown() {
    this._cooldownTurn = settings.cooldownTurnCount + 1;
  }

  /**
   * クールダウンターン経過
   */
  decreaseCooldownTurn() {
    this._cooldownTurn--;
  }

  cooldownTurnCount() {
    return this._cooldownTurn;
  }
}

const formationCooldown = new FormationCooldown();

const _Game_Party_onBattleStart = Game_Party.prototype.onBattleStart;
Game_Party.prototype.onBattleStart = function () {
  _Game_Party_onBattleStart.call(this);
  formationCooldown.initCooldown();
};

Game_Map.prototype.isFormationInBattleEnabled = function () {
  return !isMapMetaDataAvailable() || !$dataMap.meta.disableFormationInBattle;
};

const _BattleManager_startTurn = BattleManager.startTurn;
BattleManager.startTurn = function () {
  _BattleManager_startTurn.call(this);
  formationCooldown.triggerCooldown();
};

const _BattleManager_endTurn = BattleManager.endTurn;
BattleManager.endTurn = function () {
  _BattleManager_endTurn.call(this);
  /**
   * 強制入れ替えがあった場合
   */
  if (
    !formationCooldown.isDuringCooldown() &&
    settings.cooldownWithForceFormation &&
    $gameParty.forceFormationChanged &&
    $gameParty.forceFormationChanged()
  ) {
    formationCooldown.triggerCooldown();
  }
  formationCooldown.decreaseCooldownTurn();
};

/**
 * @param {Scene_Battle.prototype} sceneBattle
 */
function Scene_Battle_FormationMixIn(sceneBattle) {
  const _createAllWindows = sceneBattle.createAllWindows;
  sceneBattle.createAllWindows = function () {
    _createAllWindows.call(this);
    this.createFormationWindows();
  };

  const _createPartyCommandWindow = sceneBattle.createPartyCommandWindow;
  sceneBattle.createPartyCommandWindow = function () {
    _createPartyCommandWindow.call(this);
    this._partyCommandWindow.setHandler('formation', this.commandFormation.bind(this));
  };

  sceneBattle.createFormationWindows = function () {
    this.createFormationHelpWindow();
    this.createFormationBattleMemberWindow();
    this.createFormationWaitingMemberWindow();
    this.createFormationStatusWindow();
    this.createFormationSelectWindow();
    this.hideFormationWindows();
  };

  sceneBattle.createFormationHelpWindow = function () {
    this._formationHelpWindow = new Window_Help(this.formationHelpWindowRect());
    this._formationHelpWindow.setText(TextManager.formation);
    this.addWindow(this._formationHelpWindow);
  };

  sceneBattle.formationHelpWindowRect = function () {
    return Scene_Formation.prototype.helpWindowRect.call(this);
  };

  sceneBattle.formationHelpWindow = function () {
    return this._formationHelpWindow;
  };

  sceneBattle.cancelButtonWidth = function () {
    /**
     * 戦闘シーンではウィンドウ生成後にキャンセルボタンが生成されるため、
     * サイズ計算のために一時的にインスタンスを作る
     */
    const cancelButton = new Sprite_Button('cancel');
    return cancelButton.width;
  };

  sceneBattle.createFormationStatusWindow = function () {
    this._formationStatusWindow = new Window_FormationStatus(this.formationStatusWindowRect());
    this.addWindow(this._formationStatusWindow);
  };

  sceneBattle.formationStatusWindowRect = function () {
    return Scene_Formation.prototype.statusWindowRect.call(this);
  };

  sceneBattle.formationStatusWindowWidth = function () {
    return Scene_Formation.prototype.formationStatusWindowWidth.call(this);
  };

  sceneBattle.formationStatusWindowHeight = function () {
    return Scene_Formation.prototype.formationStatusWindowHeight.call(this);
  };

  sceneBattle.formationStatusWindow = function () {
    return this._formationStatusWindow;
  };

  sceneBattle.createFormationBattleMemberWindow = function () {
    this._formationBattleMemberWindow = new Window_FormationBattleMember(this.formationBattleMemberWindowRect());
    this.addWindow(this._formationBattleMemberWindow);
  };

  sceneBattle.formationBattleMemberWindowRect = function () {
    return Scene_Formation.prototype.battleMemberWindowRect.call(this);
  };

  sceneBattle.battleMemberWindowWidth = function () {
    return Scene_Formation.prototype.battleMemberWindowWidth.call(this);
  };

  sceneBattle.formationBattleMemberWindow = function () {
    return this._formationBattleMemberWindow;
  };

  sceneBattle.createFormationWaitingMemberWindow = function () {
    this._formationWaitingMemberWindow = new Window_FormationWaitingMember(this.formationWaitingMemberWindowRect());
    this.addWindow(this._formationWaitingMemberWindow);
  };

  sceneBattle.formationWaitingMemberWindowRect = function () {
    return Scene_Formation.prototype.waitingMemberWindowRect.call(this);
  };

  sceneBattle.waitingMemberWindowHeight = function () {
    return Scene_Formation.prototype.waitingMemberWindowHeight.call(this);
  };

  sceneBattle.formationWaitingMemberWindow = function () {
    return this._formationWaitingMemberWindow;
  };

  sceneBattle.createFormationSelectWindow = function () {
    this._formationSelectWindow = new Window_FormationSelect(this.formationSelectWindowRect());
    Scene_Formation.prototype.setupFormationSelectWindow.call(this);
  };

  sceneBattle.formationSelectWindowRect = function () {
    return Scene_Formation.prototype.selectWindowRect.call(this);
  };

  sceneBattle.formationSelectWindow = function () {
    return this._formationSelectWindow;
  };

  sceneBattle.formationStatusParamsWindowHeight = function () {
    return 0;
  };

  sceneBattle.formationStatusParamsWindow = function () {
    return null;
  };

  sceneBattle.formationEquipStatusWindow = function () {
    return null;
  };

  sceneBattle.moveCancelButtonToEdge = function () {
    if (this._cancelButton) {
      this._cancelButton.y = Math.floor((this.buttonAreaHeight() - 48) / 2);
    }
  };

  sceneBattle.returnCancelButton = function () {
    if (this._cancelButton) {
      this._cancelButton.y = this.buttonY();
    }
  };

  sceneBattle.showFormationWindows = function () {
    this._formationHelpWindow.show();
    this._formationStatusWindow.show();
    this._formationBattleMemberWindow.show();
    this._formationWaitingMemberWindow.show();
    this._formationSelectWindow.show();
    this._formationSelectWindow.select(0);
    this._formationSelectWindow.activate();
    this.moveCancelButtonToEdge();
  };

  sceneBattle.hideFormationWindows = function () {
    this._formationHelpWindow.hide();
    this._formationStatusWindow.hide();
    this._formationBattleMemberWindow.hide();
    this._formationWaitingMemberWindow.hide();
    this._formationSelectWindow.hide();
    this._formationSelectWindow.deactivate();
  };

  sceneBattle.commandFormation = function () {
    this.showFormationWindows();
  };

  sceneBattle.onFormationOk = function () {
    Scene_Formation.prototype.onFormationOk.call(this);
    $gameTemp.requestBattleRefresh();
  };

  sceneBattle.onFormationCancel = function () {
    Scene_Formation.prototype.onFormationCancel.call(this);
  };

  sceneBattle.quitFromFormation = function () {
    this.hideFormationWindows();
    this.startPartyCommandSelection();
    /**
     * コマンド入力情報初期化
     */
    $gameParty.makeActions();
  };

  const _updateCancelButton = sceneBattle.updateCancelButton;
  sceneBattle.updateCancelButton = function () {
    _updateCancelButton.call(this);
    if (this._cancelButton && !this._cancelButton.visible) {
      /**
       * 非表示になってから元の位置に戻す
       */
      this.returnCancelButton();
    }
  };
}

Scene_Battle_FormationMixIn(Scene_Battle.prototype);

Window_PartyCommand.prototype.addCommandAt = function (index, name, symbol, enabled = true, ext = null) {
  this._list.splice(index, 0, {
    name: name,
    symbol: symbol,
    enabled: enabled,
    ext: ext,
  });
};

const _Window_PartyCommand_makeCommandList = Window_PartyCommand.prototype.makeCommandList;
Window_PartyCommand.prototype.makeCommandList = function () {
  _Window_PartyCommand_makeCommandList.call(this);
  let commandName = TextManager.formation;
  if (!this.isFormationEnabled() && formationCooldown.isDuringCooldown()) {
    commandName += settings.cooldownFormat.replace(/\{turn\}/gi, formationCooldown.cooldownTurnCount());
  }
  this.addCommandAt(1, commandName, 'formation', this.isFormationEnabled());
};

Window_PartyCommand.prototype.isFormationEnabled = function () {
  return (
    $gameParty.size() >= 2 &&
    $gameSystem.isFormationEnabled() &&
    !formationCooldown.isDuringCooldown() &&
    $gameMap.isFormationInBattleEnabled()
  );
};
