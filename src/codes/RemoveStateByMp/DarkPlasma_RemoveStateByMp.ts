/// <reference path="./RemoveStateByMp.d.ts" />

function Game_Battler_RemoveStateByMpMixIn(gameBattler: Game_Battler) {
  gameBattler.removeStatesByMp = function () {
    this.states()
      .filter(state => state.meta.removeByMpLTE && Number(state.meta.removeByMpLTE) >= this.mp)
      .forEach(state => this.removeState(state.id));
  };

  /**
   * gainMp, setMp経由の場合はrefreshを呼ぶ
   */
  const _refresh = gameBattler.refresh;
  gameBattler.refresh = function () {
    _refresh.call(this);
    this.removeStatesByMp();
  };

  const _paySkillCost = gameBattler.paySkillCost;
  gameBattler.paySkillCost = function (skill) {
    _paySkillCost.call(this, skill);
    this.removeStatesByMp();
  };
}

Game_Battler_RemoveStateByMpMixIn(Game_Battler.prototype);
