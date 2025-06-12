/// <reference path="../../../typings/rmmz.d.ts" />
/// <reference path="../../ConcurrentParty/plugin/ConcurrentParty.d.ts" />

class Scene_DevideParty extends Scene_Base {
  _devidedParties: Game_DevidedParty[];

  commitDevidedPartiesAndExit() {
    $gameParty.devidePartyInto({
      parties: this._devidedParties,
      currentIndex: 0,
    });
    this.popScene();
  }

  canCommit() {
    return this._devidedParties.every(party => party.isValid());
  }
}

/**
 * TODO: Formationと共通にするべきか検討する
 */
class Window_DevidePartyWaitingMember extends Window_Selectable {

}

class Window_DevidedParty extends Window_Selectable {

}
