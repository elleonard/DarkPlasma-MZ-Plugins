/// <reference path="./ActorCommandTrait.d.ts" />

import { pluginName } from '../../common/pluginName';
import { hasTraits } from '../../common/data/hasTraits';

type ActorCommandSymbol = "attack"|"skill"|"guard"|"item";

class Data_ActorCommandTrait {
  _id: number;
  _priority: number;
  _commands: Data_ActorCommand[];

  constructor(id: number, priority: number, commands: Data_ActorCommand[]) {
    this._id = id;
    this._priority = priority;
    this._commands = commands;
  }

  static fromMeta(meta: string) {
    const lines = meta.split('\n')
      .map(line => line.trim())
      .filter(line => !!line);
    const priority = Number(lines.find(line => line.startsWith('priority:'))?.split(':')[1] || 0);
    const commands = lines.filter(line => !line.startsWith('priority:'))
      .map(line => {
        const splitted = line.split('/');
        const symbol = splitted[0];
        if (symbol !== "attack" && symbol !== "skill" && symbol !== "guard" && symbol !== "item") {
          throw new Error(`invalid symbol: ${symbol}`);
        }
        return Data_ActorCommand
          .fromSymbolAndDataId(symbol, splitted[1] ? Number(splitted[1]) : undefined);
      });
    const result = new Data_ActorCommandTrait(
      autoIncrementId,
      priority,
      commands
    );
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
  _symbol: ActorCommandSymbol;
  _dataId?: number;

  constructor(symbol: ActorCommandSymbol, dataId?: number) {
    this._symbol = symbol;
    this._dataId = dataId;
  }

  static fromSymbolAndDataId(symbol: ActorCommandSymbol, dataId?: number) {
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
      case "attack":
        return TextManager.attack;
      case "skill":
        if (this._dataId) {
          return $dataSkills[this._dataId].name;
        }
        return TextManager.skill;
      case "guard":
        return TextManager.guard;
      case "item":
        return TextManager.item;
    }
  }
}

let autoIncrementId = 0;
const $dataActorCommandTraits: Data_ActorCommandTrait[] = [];
const $dataActorCommands: {[key: string]: Data_ActorCommand} = {
  attack: new Data_ActorCommand("attack"),
  skill: new Data_ActorCommand("skill"),
  guard: new Data_ActorCommand("guard"),
  item: new Data_ActorCommand("item"),
};

const actorCommandTraitId = uniqueTraitIdCache.allocate(pluginName, 1, "アクターコマンド変更");

function DataManager_ActorCommandTraitMixIn(dataManager: typeof DataManager) {
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

function Scene_Battle_ActorCommandTraitMixIn(sceneBattle: Scene_Battle) {
  const _createActorCommandWindow = sceneBattle.createActorCommandWindow;
  sceneBattle.createActorCommandWindow = function () {
    _createActorCommandWindow.call(this);
    this._actorCommandWindow.setHandler('useSkill', () => this.commandUseSkill());
  };

  sceneBattle.commandUseSkill = function () {
    const action = BattleManager.inputtingAction();
    const skill = this._actorCommandWindow.currentExt() as MZ.Skill;
    action?.setSkill(skill.id);
    BattleManager.actor()?.setLastBattleSkill(skill);
    this.onSelectAction();
  };
}

Scene_Battle_ActorCommandTraitMixIn(Scene_Battle.prototype);

function Window_ActorCommand_ActorCommandTraitMixIn(windowClass: Window_ActorCommand) {
  const _makeCommandList = windowClass.makeCommandList;
  windowClass.makeCommandList = function () {
    if (this._actor) {
      const traits = this._actor
        .traits(actorCommandTraitId.id)
        .map(trait => $dataActorCommandTraits[trait.dataId]);
      const trait = traits.length > 0
        ? traits.reduce((a, b) => a.priority > b.priority ? a : b)
        : undefined;
      if (trait) {
        trait.commands.forEach(command => {
          switch (command.symbol) {
            case "attack":
              this.addAttackCommand();
              break;
            case "skill":
              this.addSkillCommands();
              break;
            case "guard":
              this.addGuardCommand();
              break;
            case "item":
              this.addItemCommand();
              break;
            case "useSkill":
              this.addCommand(
                command.displayName(),
                command.symbol,
                this._actor?.canUse(command.skill()!),
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
