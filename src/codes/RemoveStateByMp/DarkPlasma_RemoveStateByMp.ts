/// <reference path="./RemoveStateByMp.d.ts" />

function Game_Battler_RemoveStateByMpMixIn(gameBattler: Game_Battler) {
  gameBattler.removeStatesByMp = function () {
    this.states()
      .filter(state => state.meta.removeByMpLTE && Number(state.meta.removeByMpLTE) >= this.mp)
      .forEach(state => this.removeState(state.id));
  };

  const _gainMp = gameBattler.gainMp;
  gameBattler.gainMp = function (value) {
    _gainMp.call(this, value);
    this.removeStatesByMp();
  };
}

Game_Battler_RemoveStateByMpMixIn(Game_Battler.prototype);
