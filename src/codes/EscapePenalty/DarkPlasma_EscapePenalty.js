import { settings } from './_build/DarkPlasma_EscapePenalty_parameters';

const _BattleManager_processEscape = BattleManager.processEscape;
BattleManager.processEscape = function () {
  const success = _BattleManager_processEscape.call(this);
  if (success) {
    $gameParty.loseGoldByEscape();
  }
  return success;
};

Game_Party.prototype.loseGoldByEscape = function () {
  const lost = Math.floor((settings.loseGoldRate * this.gold()) / 100);
  if (lost > 0) {
    this.loseGold(lost);
    const message = settings.loseGoldMessage
      .replace('{gold}', `${lost}`)
      .replace('{unit}', `${TextManager.currencyUnit}`);
    $gameMessage.newPage();
    $gameMessage.add(message);
  }
};
