// DarkPlasma_ActorCommandTrait 1.0.0
// Copyright (c) 2023 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/09/17 1.0.0 公開
 */

/*:
 * @plugindesc アクターコマンドを変更する特徴
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_AllocateUniqueTraitId
 * @orderAfter DarkPlasma_AllocateUniqueTraitId
 *
 * @help
 * version: 1.0.0
 * アクターコマンドを変更する特徴を提供します。
 *
 * その特徴を追加したいデータ(ステートやアクターなど)のメモ欄に
 * 以下のように記述してください。
 * この特徴が複数設定されている場合、
 * 優先度の最も大きいものが使用されます。
 * 優先度を省略すると、優先度0として扱われます。
 * <actorCommand:
 *   priority:優先度
 *   コマンド定義
 *   コマンド定義
 *   ...
 * >
 *
 * コマンド定義の書き方
 * attack
 *   通常攻撃コマンド(戦う)
 *
 * skill
 *   スキル(スキルタイプの選択)
 *
 * skill/スキルID
 *   個別スキル
 *
 * guard
 *   防御コマンド
 *
 * item
 *   アイテムコマンド
 *
 * 記述例1: (攻撃を除いたコマンドにする)
 * <actorCommand:
 *   skill
 *   guard
 *   item
 * >
 *
 * 記述例2: (特定のスキルのみのコマンドにする。優先度1)
 * <actorCommand:
 *   priority:1
 *   skill/35
 *   skill/36
 * >
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_AllocateUniqueTraitId version:1.0.1
 * 下記プラグインと共に利用する場合、それよりも下に追加してください。
 * DarkPlasma_AllocateUniqueTraitId
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  function hasTraits(data) {
    return 'traits' in data;
  }

  class Data_ActorCommandTrait {
    constructor(id, priority, commands) {
      this._id = id;
      this._priority = priority;
      this._commands = commands;
    }
    static fromMeta(meta) {
      const lines = meta
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => !!line);
      const priority = Number(lines.find((line) => line.startsWith('priority:'))?.split(':')[1] || 0);
      const commands = lines
        .filter((line) => !line.startsWith('priority:'))
        .map((line) => {
          const splitted = line.split('/');
          const symbol = splitted[0];
          if (symbol !== 'attack' && symbol !== 'skill' && symbol !== 'guard' && symbol !== 'item') {
            throw new Error(`invalid symbol: ${symbol}`);
          }
          return Data_ActorCommand.fromSymbolAndDataId(symbol, splitted[1] ? Number(splitted[1]) : undefined);
        });
      const result = new Data_ActorCommandTrait(autoIncrementId, priority, commands);
      $dataActorCommandTraits[autoIncrementId++] = result;
      return result;
    }
    get id() {
      return this._id;
    }
    get priority() {
      return this._priority;
    }
    get commands() {
      return this._commands;
    }
  }
  class Data_ActorCommand {
    constructor(symbol, dataId) {
      this._symbol = symbol;
      this._dataId = dataId;
    }
    static fromSymbolAndDataId(symbol, dataId) {
      const key = `${symbol}${dataId ? `_${dataId}` : ''}}`;
      if ($dataActorCommands[key]) {
        return $dataActorCommands[key];
      }
      $dataActorCommands[key] = new Data_ActorCommand(symbol, dataId);
      return $dataActorCommands[key];
    }
    get symbol() {
      return this._dataId ? 'useSkill' : this._symbol;
    }
    skill() {
      return this._dataId ? $dataSkills[this._dataId] : undefined;
    }
    displayName() {
      switch (this._symbol) {
        case 'attack':
          return TextManager.attack;
        case 'skill':
          if (this._dataId) {
            return $dataSkills[this._dataId].name;
          }
          return TextManager.skill;
        case 'guard':
          return TextManager.guard;
        case 'item':
          return TextManager.item;
      }
    }
  }
  let autoIncrementId = 0;
  const $dataActorCommandTraits = [];
  const $dataActorCommands = {
    attack: new Data_ActorCommand('attack'),
    skill: new Data_ActorCommand('skill'),
    guard: new Data_ActorCommand('guard'),
    item: new Data_ActorCommand('item'),
  };
  const actorCommandTraitId = uniqueTraitIdCache.allocate(pluginName, 1, 'アクターコマンド変更');
  function DataManager_ActorCommandTraitMixIn(dataManager) {
    const _extractMetadata = dataManager.extractMetadata;
    dataManager.extractMetadata = function (data) {
      _extractMetadata.call(this, data);
      if (hasTraits(data) && data.meta.actorCommand) {
        const trait = Data_ActorCommandTrait.fromMeta(String(data.meta.actorCommand));
        data.traits.push({
          code: actorCommandTraitId.id,
          dataId: trait.id,
          value: 0,
        });
      }
    };
  }
  DataManager_ActorCommandTraitMixIn(DataManager);
  function Scene_Battle_ActorCommandTraitMixIn(sceneBattle) {
    const _createActorCommandWindow = sceneBattle.createActorCommandWindow;
    sceneBattle.createActorCommandWindow = function () {
      _createActorCommandWindow.call(this);
      this._actorCommandWindow.setHandler('useSkill', () => this.commandUseSkill());
    };
    sceneBattle.commandUseSkill = function () {
      const action = BattleManager.inputtingAction();
      const skill = this._actorCommandWindow.currentExt();
      action?.setSkill(skill.id);
      BattleManager.actor()?.setLastBattleSkill(skill);
      this.onSelectAction();
    };
  }
  Scene_Battle_ActorCommandTraitMixIn(Scene_Battle.prototype);
  function Window_ActorCommand_ActorCommandTraitMixIn(windowClass) {
    const _makeCommandList = windowClass.makeCommandList;
    windowClass.makeCommandList = function () {
      if (this._actor) {
        const traits = this._actor.traits(actorCommandTraitId.id).map((trait) => $dataActorCommandTraits[trait.dataId]);
        const trait = traits.length > 0 ? traits.reduce((a, b) => (a.priority > b.priority ? a : b)) : undefined;
        if (trait) {
          trait.commands.forEach((command) => {
            switch (command.symbol) {
              case 'attack':
                this.addAttackCommand();
                break;
              case 'skill':
                this.addSkillCommands();
                break;
              case 'guard':
                this.addGuardCommand();
                break;
              case 'item':
                this.addItemCommand();
                break;
              case 'useSkill':
                this.addCommand(
                  command.displayName(),
                  command.symbol,
                  this._actor?.canUse(command.skill()),
                  command.skill()
                );
                break;
            }
          });
          return;
        }
      }
      _makeCommandList.call(this);
    };
  }
  Window_ActorCommand_ActorCommandTraitMixIn(Window_ActorCommand.prototype);
})();
