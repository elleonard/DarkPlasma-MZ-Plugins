/// <reference path="./ForbidWaitingMemberInput.d.ts" />

function Game_Battler_ForbidWaitingMemberInputMixIn(gameBattler: Game_Battler) {
  const _canInput = gameBattler.canInput;
  gameBattler.canInput = function () {
    /**
     * canInputで this が Game_Actor であることが確定している
     */
    return _canInput.call(this) && (this as Game_Actor).isBattleMember();
  };
}

Game_Battler_ForbidWaitingMemberInputMixIn(Game_Battler.prototype);
