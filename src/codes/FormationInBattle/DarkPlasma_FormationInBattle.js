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

const _Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows;
Scene_Battle.prototype.createAllWindows = function () {
  _Scene_Battle_createAllWindows.call(this);
  this.createFormationWindows();
};

const _Scene_Battle_createPartyCommandWindow = Scene_Battle.prototype.createPartyCommandWindow;
Scene_Battle.prototype.createPartyCommandWindow = function () {
  _Scene_Battle_createPartyCommandWindow.call(this);
  this._partyCommandWindow.setHandler('formation', this.commandFormation.bind(this));
};

Scene_Battle.prototype.createFormationWindows = function () {
  this.createFormationHelpWindow();
  this.createFormationBattleMemberWindow();
  this.createFormationWaitingMemberWindow();
  this.createFormationStatusWindow();
  this.createFormationSelectWindow();
  this.hideFormationWindows();
};

Scene_Battle.prototype.createFormationHelpWindow = function () {
  this._formationHelpWindow = new Window_Help(this.formationHelpWindowRect());
  this._formationHelpWindow.setText(TextManager.formation);
  this.addWindow(this._formationHelpWindow);
};

Scene_Battle.prototype.formationHelpWindowRect = function () {
  return Scene_Formation.prototype.helpWindowRect.call(this);
};

Scene_Battle.prototype.formationHelpWindow = function () {
  return this._formationHelpWindow;
};

Scene_Battle.prototype.cancelButtonWidth = function () {
  /**
   * 戦闘シーンではウィンドウ生成後にキャンセルボタンが生成されるため、
   * サイズ計算のために一時的にインスタンスを作る
   */
  const cancelButton = new Sprite_Button('cancel');
  return cancelButton.width;
};

Scene_Battle.prototype.createFormationStatusWindow = function () {
  this._formationStatusWindow = new Window_FormationStatus(this.formationStatusWindowRect());
  this.addWindow(this._formationStatusWindow);
};

Scene_Battle.prototype.formationStatusWindowRect = function () {
  return Scene_Formation.prototype.statusWindowRect.call(this);
};

Scene_Battle.prototype.formationStatusWindowHeight = function () {
  return Scene_Formation.prototype.formationStatusWindowHeight.call(this);
};

Scene_Battle.prototype.formationStatusWindow = function () {
  return this._formationStatusWindow;
};

Scene_Battle.prototype.createFormationBattleMemberWindow = function () {
  this._formationBattleMemberWindow = new Window_FormationBattleMember(this.formationBattleMemberWindowRect());
  this.addWindow(this._formationBattleMemberWindow);
};

Scene_Battle.prototype.formationBattleMemberWindowRect = function () {
  return Scene_Formation.prototype.battleMemberWindowRect.call(this);
};

Scene_Battle.prototype.battleMemberWindowWidth = function () {
  return Scene_Formation.prototype.battleMemberWindowWidth.call(this);
};

Scene_Battle.prototype.formationBattleMemberWindow = function () {
  return this._formationBattleMemberWindow;
};

Scene_Battle.prototype.createFormationWaitingMemberWindow = function () {
  this._formationWaitingMemberWindow = new Window_FormationWaitingMember(this.formationWaitingMemberWindowRect());
  this.addWindow(this._formationWaitingMemberWindow);
};

Scene_Battle.prototype.formationWaitingMemberWindowRect = function () {
  return Scene_Formation.prototype.waitingMemberWindowRect.call(this);
};

Scene_Battle.prototype.waitingMemberWindowHeight = function () {
  return Scene_Formation.prototype.waitingMemberWindowHeight.call(this);
};

Scene_Battle.prototype.formationWaitingMemberWindow = function () {
  return this._formationWaitingMemberWindow;
};

Scene_Battle.prototype.createFormationSelectWindow = function () {
  this._formationSelectWindow = new Window_FormationSelect(this.formationSelectWindowRect());
  Scene_Formation.prototype.setupFormationSelectWindow.call(this);
};

Scene_Battle.prototype.formationSelectWindowRect = function () {
  return Scene_Formation.prototype.selectWindowRect.call(this);
};

Scene_Battle.prototype.formationSelectWindow = function () {
  return this._formationSelectWindow;
};

Scene_Battle.prototype.formationStatusParamsWindowHeight = function () {
  return 0;
};

Scene_Battle.prototype.formationStatusParamsWindow = function () {
  return null;
};

Scene_Battle.prototype.formationEquipStatusWindow = function () {
  return null;
};

Scene_Battle.prototype.moveCancelButtonToEdge = function () {
  if (this._cancelButton) {
    this._cancelButton.y = Math.floor((this.buttonAreaHeight() - 48) / 2);
  }
};

Scene_Battle.prototype.returnCancelButton = function () {
  if (this._cancelButton) {
    this._cancelButton.y = this.buttonY();
  }
};

Scene_Battle.prototype.showFormationWindows = function () {
  this._formationHelpWindow.show();
  this._formationStatusWindow.show();
  this._formationBattleMemberWindow.show();
  this._formationWaitingMemberWindow.show();
  this._formationSelectWindow.show();
  this._formationSelectWindow.select(0);
  this._formationSelectWindow.activate();
  this.moveCancelButtonToEdge();
};

Scene_Battle.prototype.hideFormationWindows = function () {
  this._formationHelpWindow.hide();
  this._formationStatusWindow.hide();
  this._formationBattleMemberWindow.hide();
  this._formationWaitingMemberWindow.hide();
  this._formationSelectWindow.hide();
  this._formationSelectWindow.deactivate();
};

Scene_Battle.prototype.commandFormation = function () {
  this.showFormationWindows();
};

Scene_Battle.prototype.onFormationOk = function () {
  Scene_Formation.prototype.onFormationOk.call(this);
  $gameTemp.requestBattleRefresh();
};

Scene_Battle.prototype.onFormationCancel = function () {
  Scene_Formation.prototype.onFormationCancel.call(this);
};

Scene_Battle.prototype.quitFromFormation = function () {
  this.hideFormationWindows();
  this.startPartyCommandSelection();
  /**
   * コマンド入力情報初期化
   */
  $gameParty.makeActions();
};

const _Scene_Battle_updateCancelButton = Scene_Battle.prototype.updateCancelButton;
Scene_Battle.prototype.updateCancelButton = function () {
  _Scene_Battle_updateCancelButton.call(this);
  if (this._cancelButton && !this._cancelButton.visible) {
    /**
     * 非表示になってから元の位置に戻す
     */
    this.returnCancelButton();
  }
};

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
  return $gameParty.size() >= 2 && $gameSystem.isFormationEnabled() && !formationCooldown.isDuringCooldown();
};
