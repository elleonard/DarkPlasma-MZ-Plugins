/// <reference path="./PreemptiveSkillTrait.d.ts" />

import { hasTraits } from '../../../common/data/hasTraits';
import { pluginName } from '../../../common/pluginName';
import { settings } from '../config/_build/DarkPlasma_PreemptiveSkillTrait_parameters';

const skillOnBattleStartTrait = uniqueTraitIdCache.allocate(pluginName, 0, "戦闘開始時スキル");

type PreemptiveSkillTrait = {
  skillId: number;
  rate: number;
};

function DataManager_PreemptiveSkillTraitMixIn(dataManager: typeof DataManager) {
  const _extractMetadata = dataManager.extractMetadata;
  dataManager.extractMetadata = function (data) {
    _extractMetadata.call(this, data);
    if (hasTraits(data) && data.meta.preemptiveSkill) {
      String(data.meta.preemptiveSkill).split('\n').map(line => {
        const skillIdMatch = line.match(/skill:(\d+)/);
        if (skillIdMatch) {
          const rateMatch = line.match(/rate:(\d+)/);
          return {
            skillId: Number(skillIdMatch[1]),
            rate: Number(rateMatch?.[1] || 100)/100,
          };
        }
      }).filter((trait): trait is PreemptiveSkillTrait => !!trait)
      .forEach(trait => {
        data.traits.push({
          code: skillOnBattleStartTrait.id,
          dataId: trait.skillId,
          value: trait.rate,
        });
      });
    }
  };
}

DataManager_PreemptiveSkillTraitMixIn(DataManager);

function BattleManager_PreemptiveSkillTraitMixIn(battleManager: typeof BattleManager) {
  const _initMembers = battleManager.initMembers;
  battleManager.initMembers = function () {
    _initMembers.call(this);
    this._isAllPreemptiveSkillFinished = false;
  }

  const _updateStart = battleManager.updateStart;
  battleManager.updateStart = function () {
    if (!this._isAllPreemptiveSkillFinished) {
      this.prepareAllPreemptiveSkills();
    } else {
      _updateStart.call(this);
    }
  };
 const _updatePhase = battleManager.updatePhase;
  battleManager.updatePhase = function (timeActive) {
    _updatePhase.call(this, timeActive);
    switch (this._phase) {
      case "preemptiveSkill":
        this.updatePreemptiveSkill();
        break;
      case "preemptiveSkillAction":
        this.updatePreemptiveSkillAction();
        break;
    }
  };

  battleManager.prepareAllPreemptiveSkills = function () {
    this._preemptiveSkillActions = [];
    if (!this._surprise) {
      $gameParty.battleMembers()
        .filter(actor => actor.canMove())
        .forEach(actor => this.preparePreemptiveSkills(actor));
    }
    if (!this._preemptive) {
      $gameTroop.members()
        .filter(enemy => enemy.canMove())
        .forEach(enemy => this.preparePreemptiveSkills(enemy));
    }
    this._phase = "preemptiveSkill";
  };

  battleManager.preparePreemptiveSkills = function (battler) {
    const preemptiveSkills = battler.preemptiveSkills();
    preemptiveSkills
      .filter(preemptiveSkill => preemptiveSkill.rate > Math.random())
      .forEach(preemptiveSkill => {
        const action = new Game_Action(battler);
        action.setSkill(preemptiveSkill.skillId);
        this._preemptiveSkillActions.push(action);
      });
  };

  battleManager.currentPreemptiveSkillAction = function () {
    return this._preemptiveSkillActions[0];
  };

  battleManager.updatePreemptiveSkill = function () {
    if (this.currentPreemptiveSkillAction()) {
      this.processPreemptiveSkill();
    } else {
      this.endPreemptiveSkill();
    }
  };

  battleManager.processPreemptiveSkill = function () {
    const action = this.currentPreemptiveSkillAction();
    if (action) {
      this._subject = action.subject();
      action.prepare();
      if (action.isValid()) {
        this.startPreemptiveSkillAction();
      }
      this._preemptiveSkillActions.shift();
    }
  };

  battleManager.endPreemptiveSkill = function () {
    this._isAllPreemptiveSkillFinished = true;
    this._phase = "start";
  };

  battleManager.startPreemptiveSkillAction = function () {
    const action = this.currentPreemptiveSkillAction()!;
    const subject = action.subject();
    const targets = action.makeTargets();
    this._phase = "preemptiveSkillAction";
    this._action = action;
    this._targets = targets;
    subject.cancelMotionRefresh();
    subject.useItem(action.item()!);
    this._action.applyGlobal();
    this._logWindow?.startPreemptiveAction(subject);
    this._logWindow?.startAction(subject, action, targets);
  };

  battleManager.updatePreemptiveSkillAction = function () {
    const target = this._targets.shift();
    if (target) {
      this.invokeAction(this._subject!, target);
    } else {
      this.endPreemptiveSkillAction();
    }
  };

  battleManager.endPreemptiveSkillAction = function () {
    this._logWindow?.endAction(this._subject!);
    this._phase = "preemptiveSkill";
  };
}

BattleManager_PreemptiveSkillTraitMixIn(BattleManager);

function Game_BattlerBase_PreemptiveSkillTraitMixIn(gameBattlerBase: Game_BattlerBase) {
  gameBattlerBase.preemptiveSkills = function () {
    return this.traits(skillOnBattleStartTrait.id).map(trait => {
      return {
        skillId: trait.dataId,
        rate: trait.value,
      };
    });
  };

  gameBattlerBase.performPreemptiveSkill = function () {
    AudioManager.playStaticSe(settings.se);
  };
}

Game_BattlerBase_PreemptiveSkillTraitMixIn(Game_BattlerBase.prototype);

function Window_BattleLog_SkillOnBattleStartTraitMixIn(windowBattleLog: Window_BattleLog) {
  windowBattleLog.startPreemptiveAction = function (subject) {
    this.push("performPreemptiveSkill", subject);
  };

  windowBattleLog.performPreemptiveSkill = function (subject) {
    subject.performPreemptiveSkill();
  };
}

Window_BattleLog_SkillOnBattleStartTraitMixIn(Window_BattleLog.prototype);
