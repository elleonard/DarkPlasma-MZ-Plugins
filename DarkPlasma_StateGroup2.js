// DarkPlasma_StateGroup2 2.0.0
// Copyright (c) 2025 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2025/08/11 2.0.0 優先度をつける機能をPriorityStateGroupに分離
 * 2025/05/18 1.2.1 プラグインパラメータでグループ設定を行うと起動時にエラーで停止する不具合を修正
 * 2022/10/15 1.2.0 DarkPlasma_StateBuffOnBattleStartにおけるグループに対する優位の挙動を定義
 * 2022/10/10 1.1.1 typescript移行
 * 2022/06/21 1.1.0 ステートを複数グループに所属させる
 *                  グループに対する優位設定
 * 2021/07/05 1.0.3 MZ 1.3.2に対応
 * 2021/06/22 1.0.2 サブフォルダからの読み込みに対応
 * 2020/09/08 1.0.1 rollup構成へ移行
 * 2020/08/27 1.0.0 MZ版公開
 */

/*:
 * @plugindesc ステートをグルーピングする
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param groups
 * @text グループ
 * @type struct<StateGroup>[]
 * @default []
 *
 * @help
 * version: 2.0.0
 *
 * ステートをグルーピングします。
 *
 * 2.0.0以降、優先度をつけて同じグループに属するステートを
 * 重複しないようにする機能は廃止されました。
 * DarkPlasma_PriorityStateGroupをご利用ください。
 *
 * ステートのメモ欄に以下のように記述すると
 * ステートをグループxに所属させることができます。
 * <stateGroup: x>
 * 複数のグループに所属させる場合は、
 * プラグインパラメータによる設定を利用してください。
 *
 * 本プラグインは単体では意味を成しません。
 * グループに関する機能を持つ他のプラグインと組み合わせてご利用ください。
 *
 */
/*~struct~StateGroup:
 * @param name
 * @desc グループの名前を指定します。半角スペース及びカンマは無視されます。
 * @text グループ名
 * @type string
 *
 * @param states
 * @desc 所属するステート設定します。
 * @text 所属ステート
 * @type state[]
 * @default []
 */
(() => {
  'use strict';

  function isState(data) {
    return $dataStates && $dataStates.includes(data);
  }

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    groups: pluginParameters.groups
      ? JSON.parse(pluginParameters.groups).map((e) => {
          return e
            ? ((parameter) => {
                const parsed = JSON.parse(parameter);
                return {
                  name: String(parsed.name || ``),
                  states: parsed.states
                    ? JSON.parse(parsed.states).map((e) => {
                        return Number(e || 0);
                      })
                    : [],
                };
              })(e)
            : { name: '', states: [] };
        })
      : [],
  };

  let stateGroupId = 1;
  const $dataStateGroups = [];
  function DataManager_StateGroupMixIn(dataManager) {
    const _extractMetadata = dataManager.extractMetadata;
    dataManager.extractMetadata = function (data) {
      _extractMetadata.call(this, data);
      if (isState(data)) {
        if (data.meta.stateGroup) {
          this.registerStateToGroup(data.id, String(data.meta.stateGroup).trim());
        }
      }
    };
    dataManager.registerStateToGroup = function (stateId, groupName) {
      const group = this.allocateStateGroup(groupName);
      if (!group.stateIds.includes(stateId)) {
        group.stateIds.push(stateId);
      }
    };
    dataManager.allocateStateGroup = function (groupName) {
      const result = $dataStateGroups.find((group) => group.name === groupName);
      if (!result) {
        const newGroup = {
          id: stateGroupId++,
          name: groupName,
          stateIds: [],
        };
        $dataStateGroups.push(newGroup);
        return newGroup;
      }
      return result;
    };
    dataManager.stateGroupByName = function (groupName) {
      return $dataStateGroups.find((group) => group.name === groupName);
    };
    dataManager.stateGroup = function (groupId) {
      return $dataStateGroups.find((group) => group.id === groupId);
    };
  }
  DataManager_StateGroupMixIn(DataManager);
  settings.groups.forEach((group) =>
    group.states.forEach((stateId) => DataManager.registerStateToGroup(stateId, group.name)),
  );
  function Game_BattlerBase_StateGroupMixIn(gameBattlerBase) {
    gameBattlerBase.isStateGroupAffected = function (groupId) {
      return DataManager.stateGroup(groupId)?.stateIds.some((stateId) => this.isStateAffected(stateId)) || false;
    };
  }
  Game_BattlerBase_StateGroupMixIn(Game_BattlerBase.prototype);
})();
