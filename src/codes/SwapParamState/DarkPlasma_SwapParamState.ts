/// <reference path="./SwapParamState.d.ts" />

function paramNameToId(paramName: string) {
  switch (paramName) {
    case "mhp":
      return 0;
    case "mmp":
      return 1;
    case "atk":
      return 2;
    case "def":
      return 3;
    case "mat":
      return 4;
    case "mdf":
      return 5;
    case "agi":
      return 6;
    case "luk":
      return 7;
  }
  return undefined;
};

function stateToSwapParamIds(state: MZ.State): [number, number]|undefined {
  const result = String(state.meta.swapParam).split(",").map(paramNameToId);
  if(result.length !== 2 || result[0] === undefined || result[1] === undefined) {
    return undefined;
  }
  return [result[0], result[1]];
}

function Game_BattlerBase_SwapParamStateMixIn(gameBattlerBase: Game_BattlerBase) {
  const _param = gameBattlerBase.param;
  gameBattlerBase.param = function (paramId) {
    return _param.call(this, this.paramAlias(paramId));
  };

  gameBattlerBase.swapParamState = function (paramId) {
    return this.states()
      .find(state => stateToSwapParamIds(state)?.includes(paramId));
  }

  gameBattlerBase.paramAlias = function (paramId) {
    const state = this.swapParamState(paramId);
    if (!state) {
      return paramId;
    }
    return stateToSwapParamIds(state)?.find(p => p !== paramId) ?? paramId;
  };

  gameBattlerBase.isSwapParamStateAffected = function (paramId) {
    return !!this.swapParamState(paramId);
  };
}

Game_BattlerBase_SwapParamStateMixIn(Game_BattlerBase.prototype);

function Game_Battler_SwapParamStateMixIn(gameBatter: Game_Battler) {
  const _isStateAddable = gameBatter.isStateAddable;
  gameBatter.isStateAddable = function (stateId) {
    return _isStateAddable.call(this, stateId)
      && (
        this.isStateAffected(stateId)
        || (stateToSwapParamIds($dataStates[stateId])?.every(
          paramId => !this.isSwapParamStateAffected(paramId)
        ) ?? true)
      );
  };
}

Game_Battler_SwapParamStateMixIn(Game_Battler.prototype);
