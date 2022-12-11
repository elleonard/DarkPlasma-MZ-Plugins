//=============================================================================
// rmmz_objects.js v1.6.0
//=============================================================================

//-----------------------------------------------------------------------------
/**
 * The game object class for temporary data that is not included in save data.
 */
declare class Game_Temp {
  public constructor();

  public _isPlaytest: boolean;
  public _destinationX: number | null;
  public _destinationY: number | null;
  public _touchTarget: Game_Battler | null;
  public _touchState: string;
  public _needsBattleRefresh: boolean;
  public _commonEventQueue: number[];
  public _animationQueue: Game_Temp.AnimationRequest[];
  public _balloonQueue: Game_Temp.BalloonRequest[];
  public _lastActionData: number[];

  public initialize(...args: any[]): void;
  public isPlaytest(): boolean;

  public setDestination(x: number, y: number): void;
  public clearDestination(): void;
  public isDestinationValid(): boolean;
  public destinationX(): number;
  public destinationY(): number;

  public setTouchState(target: Game_Battler, state: string): void;
  public clearTouchState(): void;
  public touchTarget(): Game_Battler;
  public touchState(): string;

  public requestBattleRefresh(): void;
  public clearBattleRefreshRequest(): void;
  public isBattleRefreshRequested(): boolean;

  public reserveCommonEvent(commonEventId: number): void;
  public retrieveCommonEvent(): MZ.CommonEvent;
  public isCommonEventReserved(): boolean;

  public requestAnimation(targets: Game_Character[], animationId: number, mirror?: boolean): void;
  public retrieveAnimation(): Game_Temp.AnimationRequest;
  public requestBalloon(target: Game_Character, balloonId: number): void;
  public retrieveBalloon(): Game_Temp.BalloonRequest;

  public lastActionData(type: number): number;
  public setLastActionData(type: number, value: number): void;
  public setLastUsedSkillId(skillID: number): void;
  public setLastUsedItemId(itemID: number): void;
  public setLastSubjectActorId(actorID: number): void;
  public setLastSubjectEnemyIndex(enemyIndex: number): void;
  public setLastTargetActorId(actorID: number): void;
  public setLastTargetEnemyIndex(enemyIndex: number): void;
}

declare namespace Game_Temp {
  interface AnimationRequest {
    targets: Game_Character[];
    animationId: number;
    mirror: boolean;
  }

  interface BalloonRequest {
    target: Game_Character;
    balloonId: number;
  }
}

//-----------------------------------------------------------------------------
/**
 * The game object class for the system data.
 */
declare class Game_System {
  public constructor();

  public _saveEnabled: boolean;
  public _menuEnabled: boolean;
  public _encounterEnabled: boolean;
  public _formationEnabled: boolean;
  public _battleCount: number;
  public _winCount: number;
  public _escapeCount: number;
  public _saveCount: number;
  public _versionId: number;
  public _savefileId: number;
  public _framesOnSave: number;
  public _bgmOnSave: AudioManager.AudioState | null;
  public _bgsOnSave: AudioManager.AudioState | null;
  public _windowTone: number[] | null;
  public _battleBgm: MZ.AudioFile | null;
  public _victoryMe: MZ.AudioFile | null;
  public _defeatMe: MZ.AudioFile | null;
  public _savedBgm: AudioManager.AudioState | null;
  public _walkingBgm: AudioManager.AudioState | null;

  public initialize(...args: any[]): void;
  public isJapanese(): boolean;
  public isChinese(): boolean;
  public isKorean(): boolean;
  public isCJK(): boolean;
  public isRussian(): boolean;
  public isSideView(): boolean;

  public isAutosaveEnabled(): boolean;
  public isSaveEnabled(): boolean;
  public disableSave(): void;
  public enableSave(): void;

  public isMenuEnabled(): boolean;
  public disableMenu(): void;
  public enableMenu(): void;

  public isEncounterEnabled(): boolean;
  public disableEncounter(): void;
  public enableEncounter(): void;

  public isFormationEnabled(): boolean;
  public disableFormation(): void;
  public enableFormation(): void;

  public battleCount(): number;
  public winCount(): number;
  public escapeCount(): number;
  public saveCount(): number;
  public versionId(): number;
  public savefileId(): number;
  public setSavefileId(savefileId: number): void;

  public windowTone(): number[];
  public setWindowTone(value: number[] | null): void;
  public battleBgm(): MZ.AudioFile;
  public setBattleBgm(value: MZ.AudioFile | null): void;
  public victoryMe(): MZ.AudioFile;
  public setVictoryMe(value: MZ.AudioFile | null): void;
  public defeatMe(): MZ.AudioFile;
  public setDefeatMe(value: MZ.AudioFile | null): void;

  public onBattleStart(): void;
  public onBattleWin(): void;
  public onBattleEscape(): void;
  public onBeforeSave(): void;
  public onAfterLoad(): void;

  public playtime(): number;
  public playtimeText(): string;

  public saveBgm(): void;
  public replayBgm(): void;
  public saveWalkingBgm(): void;
  public replayWalkingBgm(): void;
  public saveWalkingBgm2(): void;

  public mainFontFace(): string;
  public numberFontFace(): string;
  public mainFontSize(): number;
  public windowPadding(): number;
}

//-----------------------------------------------------------------------------
/**
 * The game object class for the timer.
 */
declare class Game_Timer {
  public constructor();

  public _frames: number;
  public _working: boolean;

  public initialize(...args: any[]): void;
  public update(sceneActive: boolean): void;
  public start(count: number): void;
  public stop(): void;
  public isWorking(): boolean;
  public seconds(): number;
  public onExpire(): void;
}

//-----------------------------------------------------------------------------
/**
 * The game object class for the state of the message window that displays text
 * or selections, etc.
 */
declare class Game_Message {
  public constructor();

  public _texts: string[];
  public _choices: string[];
  public _speakerName: string;
  public _faceName: string;
  public _faceIndex: number;
  public _background: number;
  public _positionType: number;
  public _choiceDefaultType: number;
  public _choiceCancelType: number;
  public _choiceBackground: number;
  public _choicePositionType: number;
  public _numInputVariableId: number;
  public _numInputMaxDigits: number;
  public _itemChoiceVariableId: number;
  public _itemChoiceItypeId: number;
  public _scrollMode: boolean;
  public _scrollSpeed: number;
  public _scrollNoFast: boolean;
  public _choiceCallback: (n: number) => void;

  public initialize(...args: any[]): void;
  public clear(): void;

  public choices(): string[];
  public speakerName(): string;
  public faceName(): string;
  public faceIndex(): number;
  public background(): number;
  public positionType(): number;
  public choiceDefaultType(): number;
  public choiceCancelType(): number;
  public choiceBackground(): number;
  public choicePositionType(): number;
  public numInputVariableId(): number;
  public numInputMaxDigits(): number;
  public itemChoiceVariableId(): number;
  public itemChoiceItypeId(): number;
  public scrollMode(): boolean;
  public scrollSpeed(): number;
  public scrollNoFast(): boolean;

  public add(text: string): void;
  public setSpeakerName(speakerName: string): void;
  public setFaceImage(faceName: string, faceIndex: number): void;
  public setBackground(background: number): void;
  public setPositionType(positionType: number): void;
  public setChoices(choices: string[], defaultType: number, cancelType: number): void;
  public setChoiceBackground(background: number): void;
  public setChoicePositionType(positionType: number): void;
  public setNumberInput(variableId: number, maxDigits: number): void;
  public setItemChoice(variableId: number, itemType: number): void;
  public setScroll(speed: number, noFast: boolean): void;
  public setChoiceCallback(callback: (n: number) => void): void;

  public onChoice(n: number): void;
  public hasText(): boolean;
  public isChoice(): boolean;
  public isNumberInput(): boolean;
  public isItemChoice(): boolean;
  public isBusy(): boolean;
  public newPage(): void;
  public allText(): string;
  public isRTL(): string;
}

//-----------------------------------------------------------------------------
/**
 * The game object class for switches.
 */
declare class Game_Switches {
  public constructor();

  public _data: boolean[];

  public initialize(...args: any[]): void;
  public clear(): void;
  public value(switchId: number): boolean;
  public setValue(switchId: number, value: boolean): void;
  public onChange(): void;
}

//-----------------------------------------------------------------------------
/**
 * The game object class for variables.
 */
declare class Game_Variables {
  public constructor();

  public _data: number[];

  public initialize(...args: any[]): void;
  public clear(): void;
  public value(variableId: number): number;
  public setValue(variableId: number, value: number): void;
  public onChange(): void;
}

//-----------------------------------------------------------------------------
/**
 * The game object class for self switches.
 */
type SelfSwitchKey = [number, number, string];
declare class Game_SelfSwitches {
  public constructor();

  public _data: { [key: SelfSwitchKey]: boolean };

  public initialize(...args: any[]): void;
  public clear(): void;
  public value(key: SelfSwitchKey): boolean;
  public setValue(key: SelfSwitchKey, value: boolean): void;
  public onChange(): void;
}

//-----------------------------------------------------------------------------
/**
 * The game object class for screen effect data, such as changes in color tone
 * and flashes.
 */
declare class Game_Screen {
  public constructor();

  public _brightness: number;
  public _fadeOutDuration: number;
  public _fadeInDuration: number;

  public _tone: number[];
  public _toneTarget: number[];
  public _toneDuration: number;

  public _flashColor: number[];
  public _flashDuration: number;

  public _shakePower: number;
  public _shakeSpeed: number;
  public _shakeDuration: number;
  public _shakeDirection: number;
  public _shake: number;

  public _zoomX: number;
  public _zoomY: number;
  public _zoomScale: number;
  public _zoomScaleTarget: number;
  public _zoomDuration: number;

  public _weatherType: string;
  public _weatherPower: number;
  public _weatherPowerTarget: number;
  public _weatherDuration: number;

  public _pictures: Game_Picture[];

  public initialize(...args: any[]): void;
  public clear(): void;
  public onBattleStart(): void;

  public brightness(): number;
  public tone(): number[];
  public flashColor(): number[];
  public shake(): number;
  public zoomX(): number;
  public zoomY(): number;
  public zoomScale(): number;
  public weatherType(): string;
  public weatherPower(): number;
  public picture(pictureId: number): Game_Picture;
  public realPictureId(pictureId: number): number;

  public clearFade(): void;
  public clearTone(): void;
  public clearFlash(): void;
  public clearShake(): void;
  public clearZoom(): void;
  public clearWeather(): void;
  public clearPictures(): void;
  public eraseBattlePictures(): void;
  public maxPictures(): number;

  public startFadeOut(duration: number): void;
  public startFadeIn(duration: number): void;
  public startTint(tone: number[], duration: number): void;
  public startFlash(color: number[], duration: number): void;
  public startShake(power: number, speed: number, duration: number): void;
  public startZoom(x: number, y: number, scale: number, duration: number): void;
  public setZoom(x: number, y: number, scale: number): void;
  public changeWeather(type: string, power: number, duration: number): void;

  public update(): void;
  public updateFadeOut(): void;
  public updateFadeIn(): void;
  public updateTone(): void;
  public updateFlash(): void;
  public updateShake(): void;
  public updateZoom(): void;
  public updateWeather(): void;
  public updatePictures(): void;

  public startFlashForDamage(): void;
  public showPicture(
    pictureId: number,
    name: string,
    origin: number,
    x: number,
    y: number,
    scaleX: number,
    scaleY: number,
    opacity: number,
    blendMode: number
  ): void;
  public movePicture(
    pictureId: number,
    origin: number,
    x: number,
    y: number,
    scaleX: number,
    scaleY: number,
    opacity: number,
    blendMode: number,
    duration: number
  ): void;
  public rotatePicture(pictureId: number, speed: number): void;
  public tintPicture(pictureId: number, tone: number[], duration: number): void;
  public erasePicture(pictureId: number): void;
}

//-----------------------------------------------------------------------------
/**
 * The game object class for a picture.
 */
declare class Game_Picture {
  public constructor();

  public _name: string;
  public _origin: number;
  public _x: number;
  public _y: number;
  public _scaleX: number;
  public _scaleY: number;
  public _opacity: number;
  public _blendMode: number;

  public _targetX: number;
  public _targetY: number;
  public _targetScaleX: number;
  public _targetScaleY: number;
  public _targetOpacity: number;
  public _duration: number;
  public _wholeDuration: number;
  public _easingType: number;
  public _easingExponent: number;

  public _tone: number[];
  public _toneTarget: number[];
  public _toneDuration: number;

  public _angle: number;
  public _rotationSpeed: number;

  public initialize(...args: any[]): void;

  public name(): string;
  public origin(): number;
  public x(): number;
  public y(): number;
  public scaleX(): number;
  public scaleY(): number;
  public opacity(): number;
  public blendMode(): number;
  public tone(): number[];
  public angle(): number;

  public initBasic(): void;
  public initTarget(): void;
  public initTone(): void;
  public initRotation(): void;

  public show(
    name: string,
    origin: number,
    x: number,
    y: number,
    scaleX: number,
    scaleY: number,
    opacity: number,
    blendMode: number
  ): void;
  public move(
    origin: number,
    x: number,
    y: number,
    scaleX: number,
    scaleY: number,
    opacity: number,
    blendMode: number,
    duration: number,
    easingType: number
  ): void;
  public rotate(speed: number): void;
  public tint(tone: number[], duration: number): void;

  public update(): void;
  public updateMove(): void;
  public updateTone(): void;
  public updateRotation(): void;

  public applyEasing(current: number, target: number): number;
  public calcEasing(t: number): number;
  public easeIn(t: number, exponent: number): number;
  public easeOut(t: number, exponent: number): number;
  public easeInOut(t: number, exponent: number): number;
}

//-----------------------------------------------------------------------------
/**
 * The game object class for handling skills, items, weapons, and armor. It is
 * required because save data should not include the database object itself.
 */
declare class Game_Item {
  public constructor(item?: DataManager.Item);

  public _dataClass: string;
  public _itemId: number;

  public initialize(...args: any[]): void;

  public isSkill(): boolean;
  public isItem(): boolean;
  public isUsableItem(): boolean;
  public isWeapon(): boolean;
  public isArmor(): boolean;
  public isEquipItem(): boolean;
  public isNull(): boolean;

  public itemId(): number;
  public object(): DataManager.Item | null;
  public setObject(item: DataManager.Item | null): void;
  public setEquip(isWeapon: boolean, itemId: number): void;
}

//-----------------------------------------------------------------------------
/**
 * The game object class for a battle action.
 */
declare class Game_Action {
  public constructor(subject: Game_Battler, forcing?: boolean);

  public static readonly EFFECT_RECOVER_HP: number;
  public static readonly EFFECT_RECOVER_MP: number;
  public static readonly EFFECT_GAIN_TP: number;
  public static readonly EFFECT_ADD_STATE: number;
  public static readonly EFFECT_REMOVE_STATE: number;
  public static readonly EFFECT_ADD_BUFF: number;
  public static readonly EFFECT_ADD_DEBUFF: number;
  public static readonly EFFECT_REMOVE_BUFF: number;
  public static readonly EFFECT_REMOVE_DEBUFF: number;
  public static readonly EFFECT_SPECIAL: number;
  public static readonly EFFECT_GROW: number;
  public static readonly EFFECT_LEARN_SKILL: number;
  public static readonly EFFECT_COMMON_EVENT: number;
  public static readonly SPECIAL_EFFECT_ESCAPE: number;
  public static readonly HITTYPE_CERTAIN: number;
  public static readonly HITTYPE_PHYSICAL: number;
  public static readonly HITTYPE_MAGICAL: number;

  public _subjectActorId: number;
  public _subjectEnemyIndex: number;
  public _forcing: boolean;

  public _item: Game_Item;
  public _targetIndex: number;

  public _reflectionTarget: Game_Battler | undefined;

  public initialize(...args: any[]): void;
  public clear(): void;

  public setSubject(subject: Game_Battler): void;
  public subject(): Game_Battler;
  public friendsUnit(): Game_Unit;
  public opponentsUnit(): Game_Unit;

  public setEnemyAction(action: MZ.Enemy.Action | null): void;
  public setAttack(): void;
  public setGuard(): void;
  public setSkill(skillId: number): void;
  public setItem(itemId: number): void;
  public setItemObject(object: DataManager.Item): void;
  public setTarget(targetIndex: number): void;

  public item(): DataManager.Item | null;
  public isSkill(): boolean;
  public isItem(): boolean;
  public numRepeats(): number;

  public checkItemScope(list: number[]): boolean;
  public isForOpponent(): boolean;
  public isForFriend(): boolean;
  public isForDeadFriend(): boolean;
  public isForUser(): boolean;
  public isForOne(): boolean;
  public isForRandom(): boolean;
  public isForAll(): boolean;
  public needsSelection(): boolean;
  public numTargets(): number;

  public checkDamageType(list: number[]): boolean;
  public isHpEffect(): boolean;
  public isMpEffect(): boolean;
  public isDamage(): boolean;
  public isRecover(): boolean;
  public isDrain(): boolean;
  public isHpRecover(): boolean;
  public isMpRecover(): boolean;

  public isCertainHit(): boolean;
  public isPhysical(): boolean;
  public isMagical(): boolean;
  public isAttack(): boolean;
  public isGuard(): boolean;
  public isMagicSkill(): boolean;

  public decideRandomTarget(): void;
  public setConfusion(): void;
  public prepare(): void;

  public isValid(): boolean;
  public speed(): number;

  public makeTargets(): Game_Battler[];
  public repeatTargets(targets: Game_Battler[]): Game_Battler[];
  public confusionTarget(): Game_Battler;
  public targetForEveryone(): Game_Battler[];
  public targetsForOpponents(): Game_Battler[];
  public targetsForFriends(): Game_Battler[];
  public randomTargets(unit: Game_Unit): Game_Battler[];
  public targetsForDead(unit: Game_Unit): Game_Battler[];
  public targetsForAlive(unit: Game_Unit): Game_Battler[];
  public targetsForDeadAndAlive(unit: Game_Unit): Game_Battler[];

  public evaluate(): number;
  public itemTargetCandidates(): Game_Battler[];
  public evaluateWithTarget(target: Game_Battler): number;
  public testApply(target: Game_Battler): boolean;
  public testLifeAndDeath(target: Game_Battler): boolean;
  public hasItemAnyValidEffects(target: Game_Battler): boolean;
  public testItemEffect(target: Game_Battler, effect: MZ.Effect): boolean;
  public itemCnt(target: Game_Battler): number;
  public itemMrf(target: Game_Battler): number;
  public itemHit(target: Game_Battler): number;
  public itemEva(target: Game_Battler): number;
  public itemCri(target: Game_Battler): number;
  public apply(target: Game_Battler): void;

  public makeDamageValue(target: Game_Battler, critical: boolean): number;
  public evalDamageFormula(target: Game_Battler): number;
  public calcElementRate(target: Game_Battler): number;
  public elementsMaxRate(target: Game_Battler, elements: number[]): number;
  public applyCritical(damage: number): number;
  public applyVariance(damage: number, variance: number): number;
  public applyGuard(damage: number, target: Game_Battler): number;

  public executeDamage(target: Game_Battler, value: number): void;
  public executeHpDamage(target: Game_Battler, value: number): void;
  public executeMpDamage(target: Game_Battler, value: number): void;
  public gainDrainedHp(value: number): void;
  public gainDrainedMp(value: number): void;

  public applyItemEffect(target: Game_Battler, effect: MZ.Effect): void;
  public itemEffectRecoverHp(target: Game_Battler, effect: MZ.Effect): void;
  public itemEffectRecoverMp(target: Game_Battler, effect: MZ.Effect): void;
  public itemEffectGainTp(target: Game_Battler, effect: MZ.Effect): void;
  public itemEffectAddState(target: Game_Battler, effect: MZ.Effect): void;
  public itemEffectAddAttackState(target: Game_Battler, effect: MZ.Effect): void;
  public itemEffectAddNormalState(target: Game_Battler, effect: MZ.Effect): void;
  public itemEffectRemoveState(target: Game_Battler, effect: MZ.Effect): void;
  public itemEffectAddBuff(target: Game_Battler, effect: MZ.Effect): void;
  public itemEffectAddDebuff(target: Game_Battler, effect: MZ.Effect): void;
  public itemEffectRemoveBuff(target: Game_Battler, effect: MZ.Effect): void;
  public itemEffectRemoveDebuff(target: Game_Battler, effect: MZ.Effect): void;
  public itemEffectSpecial(target: Game_Battler, effect: MZ.Effect): void;
  public itemEffectGrow(target: Game_Battler, effect: MZ.Effect): void;
  public itemEffectLearnSkill(target: Game_Battler, effect: MZ.Effect): void;
  public itemEffectCommonEvent(target: Game_Battler, effect: MZ.Effect): void;
  public makeSuccess(target: Game_Battler): void;

  public applyItemUserEffect(target: Game_Battler): void;
  public lukEffectRate(target: Game_Battler): number;
  public applyGlobal(): void;

  public updateLastUsed(): void;
  public updateLastSubject(): void;
  public updateLastTarget(): void;
}

//-----------------------------------------------------------------------------
/**
 * The game object class for a result of a battle action. For convinience, all
 * member variables in this class are public.
 */
declare class Game_ActionResult {
  public constructor();

  public used: boolean;
  public missed: boolean;
  public evaded: boolean;
  public physical: boolean;
  public drain: boolean;
  public critical: boolean;
  public success: boolean;
  public hpAffected: boolean;
  public hpDamage: number;
  public mpDamage: number;
  public tpDamage: number;
  public addedStates: number[];
  public removedStates: number[];
  public addedBuffs: number[];
  public addedDebuffs: number[];
  public removedBuffs: number[];

  public initialize(...args: any[]): void;
  public clear(): void;

  public addedStateObjects(): MZ.State[];
  public removedStateObjects(): MZ.State[];

  public isStatusAffected(): boolean;
  public isHit(): boolean;

  public isStateAdded(stateId: number): boolean;
  public pushAddedState(stateId: number): void;
  public isStateRemoved(stateId: number): boolean;
  public pushRemovedState(stateId: number): void;

  public isBuffAdded(paramId: number): boolean;
  public pushAddedBuff(paramId: number): void;
  public isDebuffAdded(paramId: number): boolean;
  public pushAddedDebuff(paramId: number): void;
  public isBuffRemoved(paramId: number): boolean;
  public pushRemovedBuff(paramId: number): void;
}

//-----------------------------------------------------------------------------
/**
 * The superclass of Game_Battler. It mainly contains parameters calculation.
 */
declare class Game_BattlerBase {
  public constructor();

  public static readonly TRAIT_ELEMENT_RATE: number;
  public static readonly TRAIT_DEBUFF_RATE: number;
  public static readonly TRAIT_STATE_RATE: number;
  public static readonly TRAIT_STATE_RESIST: number;
  public static readonly TRAIT_PARAM: number;
  public static readonly TRAIT_XPARAM: number;
  public static readonly TRAIT_SPARAM: number;
  public static readonly TRAIT_ATTACK_ELEMENT: number;
  public static readonly TRAIT_ATTACK_STATE: number;
  public static readonly TRAIT_ATTACK_SPEED: number;
  public static readonly TRAIT_ATTACK_TIMES: number;
  public static readonly TRAIT_ATTACK_SKILL: number;
  public static readonly TRAIT_STYPE_ADD: number;
  public static readonly TRAIT_STYPE_SEAL: number;
  public static readonly TRAIT_SKILL_ADD: number;
  public static readonly TRAIT_SKILL_SEAL: number;
  public static readonly TRAIT_EQUIP_WTYPE: number;
  public static readonly TRAIT_EQUIP_ATYPE: number;
  public static readonly TRAIT_EQUIP_LOCK: number;
  public static readonly TRAIT_EQUIP_SEAL: number;
  public static readonly TRAIT_SLOT_TYPE: number;
  public static readonly TRAIT_ACTION_PLUS: number;
  public static readonly TRAIT_SPECIAL_FLAG: number;
  public static readonly TRAIT_COLLAPSE_TYPE: number;
  public static readonly TRAIT_PARTY_ABILITY: number;
  public static readonly FLAG_ID_AUTO_BATTLE: number;
  public static readonly FLAG_ID_GUARD: number;
  public static readonly FLAG_ID_SUBSTITUTE: number;
  public static readonly FLAG_ID_PRESERVE_TP: number;
  public static readonly ICON_BUFF_START: number;
  public static readonly ICON_DEBUFF_START: number;

  /** Hit Points */
  public readonly hp: number;
  /** Magic Points */
  public readonly mp: number;
  /** Tactical Points */
  public readonly tp: number;
  /** Maximum Hit Points */
  public readonly mhp: number;
  /** Maximum Magic Points */
  public readonly mmp: number;
  /** ATtacK power */
  public readonly atk: number;
  /** DEFense power */
  public readonly def: number;
  /** Magic ATtack power */
  public readonly mat: number;
  /** Magic DeFense power */
  public readonly mdf: number;
  /** AGIlity */
  public readonly agi: number;
  /** LUcK */
  public readonly luk: number;
  /** HIT rate */
  public readonly hit: number;
  /** EVAsion rate */
  public readonly eva: number;
  /** CRItical rate */
  public readonly cri: number;
  /** Critical EVasion rate */
  public readonly cev: number;
  /** Magic EVasion rate */
  public readonly mev: number;
  /** Magic ReFlection rate */
  public readonly mrf: number;
  /** CouNTer attack rate */
  public readonly cnt: number;
  /** Hp ReGeneration rate */
  public readonly hrg: number;
  /** Mp ReGeneration rate */
  public readonly mrg: number;
  /** Tp ReGeneration rate */
  public readonly trg: number;
  /** TarGet Rate */
  public readonly tgr: number;
  /** GuaRD effect rate */
  public readonly grd: number;
  /** RECovery effect rate */
  public readonly rec: number;
  /** PHArmacology */
  public readonly pha: number;
  /** Mp Cost Rate */
  public readonly mcr: number;
  /** Tp Charge Rate */
  public readonly tcr: number;
  /** Physical Damage Rate */
  public readonly pdr: number;
  /** Magical Damage Rate */
  public readonly mdr: number;
  /** Floor Damage Rate */
  public readonly fdr: number;
  /** EXperience Rate */
  public readonly exr: number;

  public _hp: number;
  public _mp: number;
  public _tp: number;
  public _hidden: boolean;
  public _paramPlus: number[];
  public _states: number[];
  public _stateTurns: { [stateId: number]: number };
  public _buffs: number[];
  public _buffTurns: number[];

  public initialize(...args: any[]): void;
  public initMembers(): void;
  public clearParamPlus(): void;

  public clearStates(): void;
  public eraseState(stateId: number): void;
  public isStateAffected(stateId: number): boolean;
  public isDeathStateAffected(): boolean;
  public deathStateId(): number;
  public resetStateCounts(stateId: number): void;
  public isStateExpired(stateId: number): boolean;
  public updateStateTurns(): void;

  public clearBuffs(): void;
  public eraseBuff(paramId: number): void;
  public buffLength(): number;
  public buff(paramId: number): number;
  public isBuffAffected(paramId: number): boolean;
  public isDebuffAffected(paramId: number): boolean;
  public isBuffOrDebuffAffected(paramId: number): boolean;
  public isMaxBuffAffected(paramId: number): boolean;
  public isMaxDebuffAffected(paramId: number): boolean;
  public increaseBuff(paramId: number): void;
  public decreaseBuff(paramId: number): void;
  public overwriteBuffTurns(paramId: number, turns: number): void;
  public isBuffExpired(paramId: number): boolean;
  public updateBuffTurns(): void;

  public die(): void;
  public revive(): void;

  public states(): MZ.State[];
  public stateIcons(): number[];
  public buffIcons(): number[];
  public buffIconIndex(buffLevel: number, paramId: number): number;
  public allIcons(): number[];

  public traitObjects(): { traits: MZ.Trait[] }[];
  public allTraits(): MZ.Trait[];
  public traits(code: number): MZ.Trait[];
  public traitsWithId(code: number, id: number): MZ.Trait[];
  public traitsPi(code: number, id: number): number;
  public traitsSum(code: number, id: number): number;
  public traitsSumAll(code: number): number;
  public traitsSet(code: number): number[];

  public paramBase(paramId: number): number;
  public paramPlus(paramId: number): number;
  public paramBasePlus(paramId: number): number;
  public paramMin(paramId: number): number;
  public paramMax(paramId: number): number;
  public paramRate(paramId: number): number;
  public paramBuffRate(paramId: number): number;
  public param(paramId: number): number;
  public xparam(xparamId: number): number;
  public sparam(sparamId: number): number;

  public elementRate(elementId: number): number;
  public debuffRate(paramId: number): number;
  public stateRate(stateId: number): number;
  public stateResistSet(): number[];
  public isStateResist(stateId: number): boolean;
  public attackElements(): number[];
  public attackStates(): number[];
  public attackStatesRate(stateId: number): number;
  public attackSpeed(): number;
  public attackTimesAdd(): number;

  public addedSkillTypes(): number[];
  public isSkillTypeSealed(stypeId: number): boolean;
  public addedSkills(): number[];
  public isSkillSealed(skillId: number): boolean;
  public isEquipWtypeOk(wtypeId: number): boolean;
  public isEquipAtypeOk(atypeId: number): boolean;
  public isEquipTypeLocked(etypeId: number): boolean;
  public isEquipTypeSealed(etypeId: number): boolean;
  public slotType(): number;
  public isDualWield(): boolean;

  public actionPlusSet(): number[];
  public specialFlag(flagId: number): boolean;
  public collapseType(): number;
  public partyAbility(abilityId: number): boolean;
  public isAutoBattle(): boolean;
  public isGuard(): boolean;
  public isSubstitute(): boolean;
  public isPreserveTp(): boolean;

  public addParam(paramId: number, value: number): void;
  public setHp(hp: number): void;
  public setMp(mp: number): void;
  public setTp(tp: number): void;
  public maxTp(): number;

  public refresh(): void;
  public recoverAll(): void;

  public hpRate(): number;
  public mpRate(): number;
  public tpRate(): number;

  public hide(): void;
  public appear(): void;
  public isHidden(): boolean;
  public isAppeared(): boolean;

  public isDead(): boolean;
  public isAlive(): boolean;
  public isDying(): boolean;
  public isRestricted(): boolean;
  public canInput(): boolean;
  public canMove(): boolean;
  public isConfused(): boolean;
  public confusionLevel(): number;
  public isActor(): this is Game_Actor;
  public isEnemy(): this is Game_Enemy;

  public sortStates(): void;
  public restriction(): number;
  public addNewState(stateId: number): void;
  public onRestrict(): void;
  public mostImportantStateText(): string;
  public stateMotionIndex(): number;
  public stateOverlayIndex(): number;

  public isSkillWtypeOk(skill: MZ.Skill): boolean;
  public skillMpCost(skill: MZ.Skill): number;
  public skillTpCost(skill: MZ.Skill): number;
  public canPaySkillCost(skill: MZ.Skill): boolean;
  public paySkillCost(skill: MZ.Skill): void;

  public isOccasionOk(item: MZ.Skill | MZ.Item): boolean;
  public meetsUsableItemConditions(item: MZ.Skill | MZ.Item): boolean;
  public meetsSkillConditions(skill: MZ.Skill): boolean;
  public meetsItemConditions(item: MZ.Item): boolean;
  public canUse(item: MZ.Skill | MZ.Item): boolean;
  public canEquip(item: MZ.Weapon | MZ.Armor): boolean;
  public canEquipWeapon(item: MZ.Weapon): boolean;
  public canEquipArmor(item: MZ.Armor): boolean;

  public attackSkillId(): number;
  public guardSkillId(): number;
  public canAttack(): boolean;
  public canGuard(): boolean;
}

//-----------------------------------------------------------------------------
/**
 * The superclass of Game_Actor and Game_Enemy. It contains methods for sprites
 * and actions.
 */
declare class Game_Battler extends Game_BattlerBase {
  public constructor();

  public _actions: Game_Action[];
  public _speed: number;
  public _result: Game_ActionResult;
  public _actionState: string;
  public _lastTargetIndex: number;
  public _damagePopup: boolean;
  public _effectType: string | null;
  public _motionType: string | null;
  public _weaponImageId: number;
  public _motionRefresh: boolean;
  public _selected: boolean;
  public _tpbState: string;
  public _tpbChargeTime: number;
  public _tpbCastTime: number;
  public _tpbIdleTime: number;
  public _tpbTurnCount: number;
  public _tpbTurnEnd: boolean;

  public initialize(...args: any[]): void;
  public initMembers(): void;
  public clearDamagePopup(): void;
  public clearWeaponAnimation(): void;
  public clearEffect(): void;
  public clearMotion(): void;

  public requestEffect(effectType: string | null): void;
  public requestMotion(motionType: string | null): void;
  public requestMotionRefresh(): void;
  public select(): void;
  public deselect(): void;

  public isDamagePopupRequested(): boolean;
  public isEffectRequested(): boolean;
  public isMotionRequested(): boolean;
  public isWeaponAnimationRequested(): boolean;
  public isMotionRefreshRequested(): boolean;
  public isSelected(): boolean;

  public effectType(): string | null;
  public motionType(): string | null;
  public weaponImageId(): number;
  public startDamagePopup(): void;
  public shouldPopupDamage(): boolean;
  public startWeaponAnimation(weaponImageId: number): void;
  public action(index: number): Game_Action;
  public setAction(index: number, action: Game_Action): void;
  public numActions(): number;
  public clearActions(): void;
  public result(): Game_ActionResult;
  public clearResult(): void;

  public clearTpbChargeTime(): void;
  public applyTpbPenalty(): void;
  public initTpbChargeTime(advantageous: boolean): void;
  public tpbChargeTime(): number;
  public startTpbCasting(): void;
  public startTpbAction(): void;
  public isTpbCharged(): boolean;
  public isTpbReady(): boolean;
  public isTpbTimeout(): boolean;
  public updateTpb(): void;
  public updateTpbChargeTime(): void;
  public updateTpbCastTime(): void;
  public updateTpbAutoBattle(): void;
  public updateTpbIdleTime(): void;
  public tpbAcceleration(): number;
  public tpbRelativeSpeed(): number;
  public tpbSpeed(): number;
  public tpbBaseSpeed(): number;
  public tpbRequiredCastTime(): number;
  public onTpbCharged(): void;
  public shouldDelayTpbCharge(): boolean;
  public finishTpbCharge(): void;
  public isTpbTurnEnd(): boolean;
  public initTpbTurn(): void;
  public startTpbTurn(): void;
  public makeTpbActions(): void;
  public onTpbTimeout(): void;

  public turnCount(): number;
  public canInput(): boolean;

  public refresh(): void;
  public addState(stateId: number): void;
  public isStateAddable(stateId: number): boolean;
  public isStateRestrict(stateId: number): boolean;
  public onRestrict(): void;
  public removeState(stateId: number): void;

  public escape(): void;
  public addBuff(paramId: number, turns: number): void;
  public addDebuff(paramId: number, turns: number): void;
  public removeBuff(paramId: number): void;
  public removeBattleStates(): void;
  public removeAllBuffs(): void;
  public removeStatesAuto(timing: number): void;
  public removeBuffsAuto(): void;
  public removeStatesByDamage(): void;

  public makeActionTimes(): number;
  public makeActions(): void;
  public speed(): number;
  public makeSpeed(): number;
  public currentAction(): Game_Action;
  public removeCurrentAction(): void;
  public setLastTarget(target: Game_Battler): void;
  public forceAction(skillId: number, targetIndex: number): void;
  public useItem(item: MZ.Skill | MZ.Item): void;
  public consumeItem(item: MZ.Item): void;

  public gainHp(value: number): void;
  public gainMp(value: number): void;
  public gainTp(value: number): void;
  public gainSilentTp(value: number): void;
  public initTp(): void;
  public clearTp(): void;
  public chargeTpByDamage(damageRate: number): void;
  public regenerateHp(): void;
  public maxSlipDamage(): number;
  public regenerateMp(): void;
  public regenerateTp(): void;
  public regenerateAll(): void;

  public onBattleStart(): void;
  public onAllActionsEnd(): void;
  public onTurnEnd(): void;
  public onBattleEnd(): void;
  public onDamage(value: number): void;

  public setActionState(actionState: string): void;
  public isUndecided(): boolean;
  public isInputting(): boolean;
  public isWaiting(): boolean;
  public isActing(): boolean;
  public isChanting(): boolean;
  public isGuardWaiting(): boolean;

  public performActionStart(action: Game_Action): void;
  public performAction(action: Game_Action): void;
  public performActionEnd(): void;
  public performDamage(): void;
  public performMiss(): void;
  public performRecovery(): void;
  public performEvasion(): void;
  public performMagicEvasion(): void;
  public performCounter(): void;
  public performReflection(): void;
  public performSubstitute(target: Game_Battler): void;
  public performCollapse(): void;
}

//-----------------------------------------------------------------------------
/**
 * The game object class for an actor.
 */
declare class Game_Actor extends Game_Battler {
  public constructor(actorId: number);

  public readonly level: number;

  public _actorId: number;
  public _name: string;
  public _nickname: string;
  public _profile: string;
  public _classId: number;
  public _level: number;
  public _characterName: string;
  public _characterIndex: number;
  public _faceName: string;
  public _faceIndex: number;
  public _battlerName: string;
  public _exp: { [classId: number]: number };
  public _skills: number[];
  public _equips: Game_Item[];
  public _actionInputIndex: number;
  public _lastMenuSkill: Game_Item;
  public _lastBattleSkill: Game_Item;
  public _lastCommandSymbol: string;
  public _stateSteps: { [stateId: number]: number };

  public initialize(...args: any[]): void;
  public initMembers(): void;
  public setup(actorId: number): void;

  public actorId(): number;
  public actor(): MZ.Actor;
  public name(): string;
  public setName(name: string): void;
  public nickname(): string;
  public setNickname(nickname: string): void;
  public profile(): string;
  public setProfile(profile: string): void;
  public characterName(): string;
  public characterIndex(): number;
  public faceName(): string;
  public faceIndex(): number;
  public battlerName(): string;

  public clearStates(): void;
  public eraseState(stateId: number): void;
  public resetStateCounts(stateId: number): void;

  public initImages(): void;

  public expForLevel(level: number): number;
  public initExp(): void;
  public currentExp(): number;
  public currentLevelExp(): number;
  public nextLevelExp(): number;
  public nextRequiredExp(): number;
  public maxLevel(): number;
  public isMaxLevel(): boolean;

  public initSkills(): void;
  public initEquips(equips: number[]): void;
  public equipSlots(): number[];
  public equips(): (MZ.Weapon | MZ.Armor)[];
  public weapons(): MZ.Weapon[];
  public armors(): MZ.Armor[];
  public hasWeapon(weapon: MZ.Weapon): boolean;
  public hasArmor(armor: MZ.Armor): boolean;
  public isEquipChangeOk(slotId: number): boolean;
  public changeEquip(slotId: number, item: MZ.Weapon | MZ.Armor | null): void;
  public forceChangeEquip(slotId: number, item: MZ.Weapon | MZ.Armor | null): void;
  public tradeItemWithParty(newItem: MZ.Item|MZ.Weapon|MZ.Armor, oldItem: MZ.Item|MZ.Weapon|MZ.Armor): boolean;
  public changeEquipById(etypeId: number, itemId: number): void;
  public isEquipped(item: MZ.Weapon | MZ.Armor): boolean;
  public discardEquip(item: MZ.Weapon | MZ.Armor): void;
  public releaseUnequippableItems(forcing: boolean): void;
  public clearEquipments(): void;
  public optimizeEquipments(): void;
  public bestEquipItem(slotId: number): MZ.Weapon | MZ.Armor | null;
  public calcEquipItemPerformance(item: MZ.Weapon | MZ.Armor): number;
  public isSkillWtypeOk(skill: MZ.Skill): boolean;
  public isWtypeEquipped(wtypeId: number): boolean;

  public refresh(): void;

  public hide(): void;

  public isActor(): boolean;
  public friendsUnit(): Game_Unit;
  public opponentsUnit(): Game_Unit;
  public index(): number;
  public isBattleMember(): boolean;
  public isFormationChangeOk(): boolean;
  public currentClass(): MZ.Class;
  public isClass(gameClass: MZ.Class): boolean;
  public skillTypes(): number[];
  public skills(): MZ.Skill[];
  public usableSkills(): MZ.Skill[];
  public traitObjects(): { traits: MZ.Trait[] }[];
  public attackElements(): number[];
  public hasNoWeapons(): boolean;
  public bareHandsElementId(): number;

  public paramBase(paramId: number): number;
  public paramPlus(paramId: number): number;
  public attackAnimationId1(): number;
  public attackAnimationId2(): number;
  public bareHandsAnimationId(): number;

  public changeExp(exp: number, show: boolean): void;
  public levelUp(): void;
  public levelDown(): void;
  public findNewSkills(lastSkills: MZ.Skill[]): MZ.Skill[];
  public displayLevelUp(newSkills: MZ.Skill[]): void;
  public gainExp(exp: number): void;
  public finalExpRate(): number;
  public benchMembersExpRate(): number;
  public shouldDisplayLevelUp(): boolean;
  public changeLevel(level: number, show: boolean): void;

  public learnSkill(skillId: number): void;
  public forgetSkill(skillId: number): void;
  public isLearnedSkill(skillId: number): boolean;
  public hasSkill(skillId: number): boolean;

  public changeClass(classId: number, keepExp: boolean): void;

  public setCharacterImage(characterName: string, characterIndex: number): void;
  public setFaceImage(faceName: string, faceIndex: number): void;
  public setBattlerImage(battlerName: string): void;
  public isSpriteVisible(): boolean;

  public performActionStart(action: Game_Action): void;
  public performAction(action: Game_Action): void;
  public performActionEnd(): void;
  public performAttack(): void;
  public performDamage(): void;
  public performEvasion(): void;
  public performMagicEvasion(): void;
  public performCounter(): void;
  public performCollapse(): void;
  public performVictory(): void;
  public performEscape(): void;

  public makeActionList(): Game_Action[];
  public makeAutoBattleActions(): void;
  public makeConfusionActions(): void;
  public makeActions(): void;

  public onPlayerWalk(): void;
  public updateStateSteps(state: MZ.State): void;
  public showAddedStates(): void;
  public showRemovedStates(): void;
  public stepsForTurn(): number;
  public turnEndOnMap(): void;
  public checkFloorEffect(): void;
  public executeFloorDamage(): void;
  public basicFloorDamage(): number;
  public maxFloorDamage(): number;
  public performMapDamage(): void;

  public clearActions(): void;
  public inputtingAction(): Game_Action;
  public selectNextCommand(): boolean;
  public selectPreviousCommand(): boolean;
  public lastSkill(): MZ.Skill | null;
  public lastMenuSkill(): MZ.Skill | null;
  public setLastMenuSkill(skill: MZ.Skill | null): void;
  public lastBattleSkill(): MZ.Skill | null;
  public setLastBattleSkill(skill: MZ.Skill | null): void;
  public lastCommandSymbol(): string;
  public setLastCommandSymbol(symbol: string): void;
  public testEscape(item: MZ.Skill | MZ.Item): boolean;
  public meetsUsableItemConditions(item: MZ.Skill | MZ.Item): boolean;
  public onEscapeFailure(): void;
}

//-----------------------------------------------------------------------------
/**
 * The game object class for an enemy.
 */
declare class Game_Enemy extends Game_Battler {
  public constructor(enemyId: number, x: number, y: number);

  public _enemyId: number;
  public _letter: string;
  public _plural: boolean;
  public _screenX: number;
  public _screenY: number;

  public initialize(...args: any[]): void;
  public initMembers(): void;
  public setup(enemyId: number, x: number, y: number): void;

  public isEnemy(): boolean;
  public friendsUnit(): Game_Unit;
  public opponentsUnit(): Game_Unit;
  public index(): number;
  public isBattleMember(): boolean;
  public enemyId(): number;
  public enemy(): MZ.Enemy;
  public traitObjects(): { traits: MZ.Trait[] }[];

  public paramBase(paramId: number): number;
  public exp(): number;
  public gold(): number;
  public makeDropItems(): (MZ.Item | MZ.Weapon | MZ.Armor | null)[];
  public dropItemRate(): number;
  public itemObject(kind: number, dataId: number): MZ.Item | MZ.Weapon | MZ.Armor | null;

  public isSpriteVisible(): boolean;
  public screenX(): number;
  public screenY(): number;
  public battlerName(): string;
  public battlerHue(): number;
  public originalName(): string;
  public name(): string;
  public isLetterEmpty(): boolean;
  public setLetter(letter: string): void;
  public setPlural(plural: boolean): void;

  public performActionStart(action: Game_Action): void;
  public performAction(action: Game_Action): void;
  public performActionEnd(): void;
  public performDamage(): void;
  public performCollapse(): void;

  public transform(enemyId: number): void;

  public meetsCondition(action: MZ.Enemy.Action): boolean;
  public meetsTurnCondition(param1: number, param2: number): boolean;
  public meetsHpCondition(param1: number, param2: number): boolean;
  public meetsMpCondition(param1: number, param2: number): boolean;
  public meetsStateCondition(param: number): boolean;
  public meetsPartyLevelCondition(param: number): boolean;
  public meetsSwitchCondition(param: number): boolean;
  public isActionValid(action: MZ.Enemy.Action): boolean;
  public selectAction(actionList: MZ.Enemy.Action[], ratingZero: number): MZ.Enemy.Action | null;
  public selectAllActions(actionList: MZ.Enemy.Action[]): void;
  public makeActions(): void;
}

//-----------------------------------------------------------------------------
/**
 * The wrapper class for an actor array.
 */
declare class Game_Actors {
  public constructor();

  public _data: Game_Actor[];

  public initialize(...args: any[]): void;
  public actor(actorId: number): Game_Actor | null;
}

//-----------------------------------------------------------------------------
/**
 * The superclass of Game_Party and Game_Troop.
 */
declare class Game_Unit {
  public constructor();

  public _inBattle: boolean;

  public initialize(...args: any[]): void;

  public inBattle(): boolean;
  public members(): Game_Battler[];
  public aliveMembers(): Game_Battler[];
  public deadMembers(): Game_Battler[];
  public movableMembers(): Game_Battler[];

  public clearActions(): void;

  public agility(): number;
  public tgrSum(): number;
  public randomTarget(): Game_Battler;
  public randomDeadTarget(): Game_Battler;
  public smoothTarget(index: number): Game_Battler;
  public smoothDeadTarget(index: number): Game_Battler;

  public clearResults(): void;

  public onBattleStart(): void;
  public onBattleEnd(): void;
  public makeActions(): void;
  public select(activeMember: Game_Battler): void;

  public isAllDead(): boolean;
  public substituteBattler(): Game_Battler;

  public tpbBaseSpeed(): number;
  public tpbReferenceTime(): number;
  public updateTpb(): void;
}

//-----------------------------------------------------------------------------
/**
 * The game object class for the party. Information such as gold and items is
 * included.
 */
declare class Game_Party extends Game_Unit {
  public constructor();

  public static readonly ABILITY_ENCOUNTER_HALF: number;
  public static readonly ABILITY_ENCOUNTER_NONE: number;
  public static readonly ABILITY_CANCEL_SURPRISE: number;
  public static readonly ABILITY_RAISE_PREEMPTIVE: number;
  public static readonly ABILITY_GOLD_DOUBLE: number;
  public static readonly ABILITY_DROP_ITEM_DOUBLE: number;

  public _gold: number;
  public _steps: number;
  public _lastItem: Game_Item;
  public _menuActorId: number;
  public _targetActorId: number;
  public _actors: number[];
  public _items: { [id: number]: number };
  public _weapons: { [id: number]: number };
  public _armors: { [id: number]: number };

  public initialize(...args: any[]): void;
  public initAllItems(): void;

  public exists(): boolean;
  public size(): number;
  public isEmpty(): boolean;
  public members(): Game_Actor[];
  public allMembers(): Game_Actor[];
  public battleMembers(): Game_Actor[];
  public maxBattleMembers(): number;
  public leader(): Game_Actor;

  public removeInvalidMembers(): void;

  public reviveBattleMembers(): void;

  public items(): MZ.Item[];
  public weapons(): MZ.Weapon[];
  public armors(): MZ.Armor[];
  public equipItems(): (MZ.Weapon | MZ.Armor)[];
  public allItems(): (MZ.Item | MZ.Weapon | MZ.Armor)[];
  public itemContainer(item: MZ.Item | MZ.Weapon | MZ.Armor): { [id: number]: number } | null;

  public setupStartingMembers(): void;

  public name(): string;

  public setupBattleTest(): void;
  public setupBattleTestMembers(): void;
  public setupBattleTestItems(): void;

  public highestLevel(): number;

  public addActor(actorId: number): void;
  public removeActor(actorId: number): void;

  public gold(): number;
  public gainGold(amount: number): void;
  public loseGold(amount: number): void;
  public maxGold(): number;
  public steps(): number;
  public increaseSteps(): void;

  public numItems(item: MZ.Item | MZ.Weapon | MZ.Armor): number;
  public maxItems(item: MZ.Item | MZ.Weapon | MZ.Armor): number;
  public hasMaxItems(item: MZ.Item | MZ.Weapon | MZ.Armor): boolean;
  public hasItem(item: MZ.Item | MZ.Weapon | MZ.Armor | null, includeEquip?: boolean): boolean;
  public isAnyMemberEquipped(item: MZ.Weapon | MZ.Armor): boolean;
  public gainItem(item: MZ.Item | MZ.Weapon | MZ.Armor, amount: number, includeEquip?: boolean): void;
  public discardMembersEquip(item: MZ.Weapon | MZ.Armor, amount: number): void;
  public loseItem(item: MZ.Item | MZ.Weapon | MZ.Armor, amount: number, includeEquip: boolean): void;
  public consumeItem(item: MZ.Item): void;
  public canUse(item: MZ.Item): boolean;

  public canInput(): boolean;
  public isAllDead(): boolean;

  public onPlayerWalk(): void;

  public menuActor(): Game_Actor;
  public setMenuActor(actor: Game_Actor): void;
  public makeMenuActorNext(): void;
  public makeMenuActorPrevious(): void;
  public targetActor(): Game_Actor;
  public setTargetActor(actor: Game_Actor): void;

  public lastItem(): MZ.Item | MZ.Weapon | MZ.Armor | null;
  public setLastItem(item: MZ.Item | MZ.Weapon | MZ.Armor | null): void;

  public swapOrder(index1: number, index2: number): void;

  public charactersForSavefile(): [string, number][];
  public facesForSavefile(): [string, number][];

  public partyAbility(abilityId: number): boolean;
  public hasEncounterHalf(): boolean;
  public hasEncounterNone(): boolean;
  public hasCancelSurprise(): boolean;
  public hasRaisePreemptive(): boolean;
  public hasGoldDouble(): boolean;
  public hasDropItemDouble(): boolean;

  public ratePreemptive(troopAgi: number): number;
  public rateSurprise(troopAgi: number): number;

  public performVictory(): void;
  public performEscape(): void;
  public removeBattleStates(): void;
  public requestMotionRefresh(): void;

  public onEscapeFailure(): void;
}

//-----------------------------------------------------------------------------
/**
 * The game object class for a troop and the battle-related data.
 */
declare class Game_Troop extends Game_Unit {
  public constructor();

  public static readonly LETTER_TABLE_HALF: ReadonlyArray<string>;
  public static readonly LETTER_TABLE_FULL: ReadonlyArray<string>;

  public _interpreter: Game_Interpreter;
  public _troopId: number;
  public _eventFlags: { [index: number]: boolean };
  public _enemies: Game_Enemy[];
  public _turnCount: number;
  public _namesCount: { [name: string]: number };

  public initialize(...args: any[]): void;

  public isEventRunning(): boolean;

  public updateInterpreter(): void;

  public turnCount(): number;
  public members(): Game_Enemy[];

  public clear(): void;

  public troop(): MZ.Troop;

  public setup(troopId: number): void;
  public makeUniqueNames(): void;
  public updatePluralFlags(): void;

  public letterTable(): ReadonlyArray<string>;
  public enemyNames(): string[];

  public meetsConditions(page: MZ.EventPage): boolean;

  public setupBattleEvent(): void;
  public increaseTurn(): void;

  public expTotal(): number;
  public goldTotal(): number;
  public goldRate(): number;
  public makeDropItems(): (MZ.Item | MZ.Weapon | MZ.Armor | null)[];
  public isTpbTurnEnd(): boolean;
}

//-----------------------------------------------------------------------------
/**
 * The game object class for a map. It contains scrolling and passage
 * determination functions.
 */
declare class Game_Map {
  public constructor();

  public _interpreter: Game_Interpreter;
  public _mapId: number;
  public _tilesetId: number;
  public _events: Game_Event[];
  public _commonEvents: Game_CommonEvent[];
  public _vehicles: Game_Vehicle[];
  public _displayX: number;
  public _displayY: number;
  public _nameDisplay: boolean;
  public _scrollDirection: number;
  public _scrollRest: number;
  public _scrollSpeed: number;
  public _parallaxName: string;
  public _parallaxZero: boolean;
  public _parallaxLoopX: boolean;
  public _parallaxLoopY: boolean;
  public _parallaxSx: number;
  public _parallaxSy: number;
  public _parallaxX: number;
  public _parallaxY: number;
  public _battleback1Name: string | null;
  public _battleback2Name: string | null;
  public _needsRefresh: boolean;

  public _tileEvents: Game_Event[];

  public initialize(...args: any[]): void;
  public setup(mapId: number): void;

  public isEventRunning(): boolean;
  public tileWidth(): number;
  public tileHeight(): number;
  public mapId(): number;
  public tilesetId(): number;
  public displayX(): number;
  public displayY(): number;
  public parallaxName(): string;
  public battleback1Name(): string | null;
  public battleback2Name(): string | null;

  public requestRefresh(mapId?: number): void;

  public isNameDisplayEnabled(): boolean;
  public disableNameDisplay(): void;
  public enableNameDisplay(): void;

  public createVehicles(): void;
  public refereshVehicles(): void;
  public vehicles(): Game_Vehicle[];
  public vehicle(type: number | string): Game_Vehicle | null;
  public boat(): Game_Vehicle;
  public ship(): Game_Vehicle;
  public airship(): Game_Vehicle;

  public setupEvents(): void;
  public events(): Game_Event[];
  public event(eventId: number): Game_Event;
  public eraseEvent(eventId: number): void;
  public autorunCommonEvents(): MZ.CommonEvent[];
  public parallelCommonEvents(): MZ.CommonEvent[];

  public setupScroll(): void;
  public setupParallax(): void;
  public setupBattleback(): void;
  public setDisplayPos(x: number, y: number): void;
  public parallaxOx(): number;
  public parallaxOy(): number;

  public tileset(): MZ.Tileset;
  public tilesetFlags(): number[];

  public displayName(): string;
  public width(): number;
  public height(): number;
  public data(): number[];
  public isLoopHorizontal(): boolean;
  public isLoopVertical(): boolean;
  public isDashDisabled(): boolean;
  public encounterList(): MZ.Map.Encounter[];
  public encounterStep(): number;
  public isOverworld(): boolean;

  public screenTileX(): number;
  public screenTileY(): number;
  public adjustX(x: number): number;
  public adjustY(y: number): number;
  public roundX(x: number): number;
  public roundY(y: number): number;
  public xWithDirection(x: number, d: number): number;
  public yWithDirection(y: number, d: number): number;
  public roundXWithDirection(x: number, d: number): number;
  public roundYWithDirection(y: number, d: number): number;
  public deltaX(x1: number, x2: number): number;
  public deltaY(y1: number, y2: number): number;
  public distance(x1: number, y1: number, x2: number, y2: number): number;
  public canvasToMapX(x: number): number;
  public canvasToMapY(y: number): number;

  public autoplay(): void;

  public refreshIfNeeded(): void;
  public refresh(): void;
  public refreshTileEvents(): void;

  public eventsXy(x: number, y: number): Game_Event[];
  public eventsXyNt(x: number, y: number): Game_Event[];
  public tileEventsXy(x: number, y: number): Game_Event[];
  public eventIdXy(x: number, y: number): number;

  public scrollDown(distance: number): void;
  public scrollLeft(distance: number): void;
  public scrollRight(distance: number): void;
  public scrollUp(distance: number): void;

  public isValid(x: number, y: number): boolean;
  public checkPassage(x: number, y: number, bit: number): boolean;
  public tileId(x: number, y: number, z: number): number;
  public layeredTiles(x: number, y: number): number[];
  public allTiles(x: number, y: number): number[];

  public autotileType(x: number, y: number, z: number): number;
  public isPassable(x: number, y: number, d: number): boolean;
  public isBoatPassable(x: number, y: number): boolean;
  public isShipPassable(x: number, y: number): boolean;
  public isAirshipLandOk(x: number, y: number): boolean;
  public checkLayeredTilesFlags(x: number, y: number, bit: number): boolean;
  public isLadder(x: number, y: number): boolean;
  public isBush(x: number, y: number): boolean;
  public isCounter(x: number, y: number): boolean;
  public isDamageFloor(x: number, y: number): boolean;
  public terrainTag(x: number, y: number): number;
  public regionId(x: number, y: number): number;

  public startScroll(direction: number, distance: number, speed: number): void;
  public isScrolling(): boolean;

  public update(sceneActive: boolean): void;
  public updateScroll(): void;
  public scrollDistance(): number;
  public doScroll(direction: number, distance: number): void;
  public updateEvents(): void;
  public updateVehicles(): void;
  public updateParallax(): void;

  public changeTileset(tilesetId: number): void;
  public changeBattleback(battleback1Name: string | null, battleback2Name: string | null): void;
  public changeParallax(name: string, loopX: boolean, loopY: boolean, sx: number, sy: number): void;

  public updateInterpreter(): void;
  public unlockEvent(eventId: number): void;
  public setupStartingEvent(): boolean;
  public setupTestEvent(): boolean;
  public setupStartingMapEvent(): boolean;
  public setupAutorunCommonEvent(): boolean;
  public isAnyEventStarting(): boolean;
}

//-----------------------------------------------------------------------------
/**
 * The game object class for a common event. It contains functionality for
 * running parallel process events.
 */
declare class Game_CommonEvent {
  public constructor(commonEventId: number);

  public _commonEventId: number;
  public _interpreter: Game_Interpreter | null;

  public initialize(...args: any[]): void;

  public event(): MZ.CommonEvent;
  public list(): MZ.EventCommand[];

  public refresh(): void;
  public isActive(): boolean;
  public update(): void;
}

//-----------------------------------------------------------------------------
/**
 * The superclass of Game_Character. It handles basic information, such as
 * coordinates and images, shared by all characters.
 */
declare class Game_CharacterBase {
  public constructor();

  public readonly x: number;
  public readonly y: number;

  public _x: number;
  public _y: number;
  public _realX: number;
  public _realY: number;
  public _moveSpeed: number;
  public _moveFrequency: number;
  public _opacity: number;
  public _blendMode: number;
  public _direction: number;
  public _pattern: number;
  public _priorityType: number;
  public _tileId: number;
  public _characterName: string;
  public _characterIndex: number;
  public _isObjectCharacter: boolean;
  public _walkAnime: boolean;
  public _stepAnime: boolean;
  public _directionFix: boolean;
  public _through: boolean;
  public _transparent: boolean;
  public _bushDepth: number;
  public _animationId: number;
  public _balloonId: number;
  public _animationPlaying: boolean;
  public _balloonPlaying: boolean;
  public _animationCount: number;
  public _stopCount: number;
  public _jumpCount: number;
  public _jumpPeak: number;
  public _movementSuccess: boolean;

  public initialize(...args: any[]): void;
  public initMembers(): void;

  public pos(x: number, y: number): boolean;
  public posNt(x: number, y: number): boolean;
  public moveSpeed(): number;
  public setMoveSpeed(moveSpeed: number): void;
  public moveFrequency(): number;
  public setMoveFrequency(moveFrequency: number): void;
  public opacity(): number;
  public setOpacity(opacity: number): void;
  public blendMode(): number;
  public setBlendMode(blendMode: number): void;
  public isNormalPriority(): boolean;
  public setPriorityType(priorityType: number): void;
  public isMoving(): boolean;
  public isJumping(): boolean;
  public jumpHeight(): number;
  public isStopping(): boolean;
  public checkStop(threshold: number): boolean;
  public resetStopCount(): void;
  public realMoveSpeed(): number;
  public distancePerFrame(): number;
  public isDashing(): boolean;
  public isDebugThrough(): boolean;

  public straighten(): void;
  public reverseDir(d: number): number;
  public canPass(x: number, y: number, d: number): boolean;
  public canPassDiagonally(x: number, y: number, horz: number, vert: number): boolean;
  public isMapPassable(x: number, y: number, d: number): boolean;
  public isCollidedWithCharacters(x: number, y: number): boolean;
  public isCollidedWithEvents(x: number, y: number): boolean;
  public isCollidedWithVehicles(x: number, y: number): boolean;

  public setPosition(x: number, y: number): void;
  public copyPosition(character: Game_CharacterBase): void;
  public locate(x: number, y: number): void;
  public direction(): number;
  public setDirection(d: number): void;

  public isTile(): boolean;
  public isObjectCharacter(): boolean;
  public shiftY(): number;
  public scrolledX(): number;
  public scrolledY(): number;
  public screenX(): number;
  public screenY(): number;
  public screenZ(): number;
  public isNearTheScreen(): boolean;

  public update(): void;
  public updateStop(): void;
  public updateJump(): void;
  public updateMove(): void;
  public updateAnimation(): void;
  public animationWait(): number;
  public updateAnimationCount(): void;
  public updatePattern(): void;
  public maxPattern(): number;
  public pattern(): number;
  public setPattern(pattern: number): void;
  public isOriginalPattern(): boolean;
  public resetPattern(): void;

  public refreshBushDepth(): void;
  public isOnLadder(): boolean;
  public isOnBush(): boolean;
  public terrainTag(): number;
  public regionId(): number;
  public increaseSteps(): void;

  public tileId(): number;
  public characterName(): string;
  public characterIndex(): number;
  public setImage(characterName: string, characterIndex: number): void;
  public setTileImage(tileId: number): void;

  public checkEventTriggerTouchFront(d: number): void;
  public checkEventTriggerTouch(x: number, y: number): void;
  public isMovementSucceeded(x?: number, y?: number): boolean;
  public setMovementSuccess(success: boolean): void;
  public moveStraight(d: number): void;
  public moveDiagonally(horz: number, vert: number): void;
  public jump(xPlus: number, yPlus: number): void;

  public hasWalkAnime(): boolean;
  public setWalkAnime(walkAnime: boolean): void;
  public hasStepAnime(): boolean;
  public setStepAnime(stepAnime: boolean): void;
  public isDirectionFixed(): boolean;
  public setDirectionFix(directionFix: boolean): void;
  public isThrough(): boolean;
  public setThrough(through: boolean): void;
  public isTransparent(): boolean;
  public bushDepth(): number;
  public setTransparent(transparent: boolean): void;

  public startAnimation(): void;
  public startBalloon(): void;
  public isAnimationPlaying(): boolean;
  public isBalloonPlaying(): boolean;
  public endAnimation(): void;
  public endBalloon(): void;
}

//-----------------------------------------------------------------------------
/**
 * The superclass of Game_Player, Game_Follower, GameVehicle, and Game_Event.
 */
declare class Game_Character extends Game_CharacterBase {
  public constructor();

  public static readonly ROUTE_END: number;
  public static readonly ROUTE_MOVE_DOWN: number;
  public static readonly ROUTE_MOVE_LEFT: number;
  public static readonly ROUTE_MOVE_RIGHT: number;
  public static readonly ROUTE_MOVE_UP: number;
  public static readonly ROUTE_MOVE_LOWER_L: number;
  public static readonly ROUTE_MOVE_LOWER_R: number;
  public static readonly ROUTE_MOVE_UPPER_L: number;
  public static readonly ROUTE_MOVE_UPPER_R: number;
  public static readonly ROUTE_MOVE_RANDOM: number;
  public static readonly ROUTE_MOVE_TOWARD: number;
  public static readonly ROUTE_MOVE_AWAY: number;
  public static readonly ROUTE_MOVE_FORWARD: number;
  public static readonly ROUTE_MOVE_BACKWARD: number;
  public static readonly ROUTE_JUMP: number;
  public static readonly ROUTE_WAIT: number;
  public static readonly ROUTE_TURN_DOWN: number;
  public static readonly ROUTE_TURN_LEFT: number;
  public static readonly ROUTE_TURN_RIGHT: number;
  public static readonly ROUTE_TURN_UP: number;
  public static readonly ROUTE_TURN_90D_R: number;
  public static readonly ROUTE_TURN_90D_L: number;
  public static readonly ROUTE_TURN_180D: number;
  public static readonly ROUTE_TURN_90D_R_L: number;
  public static readonly ROUTE_TURN_RANDOM: number;
  public static readonly ROUTE_TURN_TOWARD: number;
  public static readonly ROUTE_TURN_AWAY: number;
  public static readonly ROUTE_SWITCH_ON: number;
  public static readonly ROUTE_SWITCH_OFF: number;
  public static readonly ROUTE_CHANGE_SPEED: number;
  public static readonly ROUTE_CHANGE_FREQ: number;
  public static readonly ROUTE_WALK_ANIME_ON: number;
  public static readonly ROUTE_WALK_ANIME_OFF: number;
  public static readonly ROUTE_STEP_ANIME_ON: number;
  public static readonly ROUTE_STEP_ANIME_OFF: number;
  public static readonly ROUTE_DIR_FIX_ON: number;
  public static readonly ROUTE_DIR_FIX_OFF: number;
  public static readonly ROUTE_THROUGH_ON: number;
  public static readonly ROUTE_THROUGH_OFF: number;
  public static readonly ROUTE_TRANSPARENT_ON: number;
  public static readonly ROUTE_TRANSPARENT_OFF: number;
  public static readonly ROUTE_CHANGE_IMAGE: number;
  public static readonly ROUTE_CHANGE_OPACITY: number;
  public static readonly ROUTE_CHANGE_BLEND_MODE: number;
  public static readonly ROUTE_PLAY_SE: number;
  public static readonly ROUTE_SCRIPT: number;

  public _moveRouteForcing: boolean;
  public _moveRoute: MZ.MoveRoute | null;
  public _moveRouteIndex: number;
  public _originalMoveRoute: MZ.MoveRoute | null;
  public _originalMoveRouteIndex: number;
  public _waitCount: number;

  public initialize(...args: any[]): void;
  public initMembers(): void;

  public memorizeMoveRoute(): void;
  public restoreMoveRoute(): void;

  public isMoveRouteForcing(): boolean;
  public setMoveRoute(moveRoute: MZ.MoveRoute | null): void;
  public forceMoveRoute(moveRoute: MZ.MoveRoute | null): void;

  public updateStop(): void;
  public updateRoutineMove(): void;

  public processMoveCommand(command: MZ.MoveCommand): void;
  public deltaXFrom(x: number): number;
  public deltaYFrom(y: number): number;
  public moveRandom(): void;
  public moveTowardCharacter(character: Game_Character): void;
  public moveAwayFromCharacter(character: Game_Character): void;
  public turnTowardCharacter(character: Game_Character): void;
  public turnAwayFromCharacter(character: Game_Character): void;
  public turnTowardPlayer(): void;
  public turnAwayFromPlayer(): void;
  public moveTowardPlayer(): void;
  public moveAwayFromPlayer(): void;
  public moveForward(): void;
  public moveBackward(): void;
  public processRouteEnd(): void;
  public advanceMoveRouteIndex(): void;
  public turnRight90(): void;
  public turnLeft90(): void;
  public turn180(): void;
  public turnRightOrLeft90(): void;
  public turnRandom(): void;

  public swap(character: Game_Character): void;
  public findDirectionTo(goalX: number, goalY: number): number;
  public searchLimit(): number;
}

//-----------------------------------------------------------------------------
/**
 * The game object class for the player. It contains event starting
 * determinants and map scrolling functions.
 */
declare class Game_Player extends Game_Character {
  public constructor();

  public _vehicleType: string;
  public _vehicleGettingOn: boolean;
  public _vehicleGettingOff: boolean;
  public _dashing: boolean;
  public _needsMapReload: boolean;
  public _transferring: boolean;
  public _newMapId: number;
  public _newX: number;
  public _newY: number;
  public _newDirection: number;
  public _fadeType: number;
  public _followers: Game_Followers;
  public _encounterCount: number;

  public initialize(...args: any[]): void;
  public initMembers(): void;
  public clearTransferInfo(): void;

  public followers(): Game_Followers;

  public refresh(): void;

  public isStopping(): boolean;

  public reserveTransfer(mapId: number, x: number, y: number, d: number, fadeType: number): void;
  public setupForNewGame(): void;
  public requestMapReload(): void;
  public isTransferring(): boolean;
  public newMapId(): number;
  public fadeType(): number;
  public performTransfer(): void;

  public isMapPassable(x: number, y: number, d: number): boolean;

  public vehicle(): Game_Vehicle;
  public isInBoat(): boolean;
  public isInShip(): boolean;
  public isInAirship(): boolean;
  public isInVehicle(): boolean;
  public isNormal(): boolean;
  public isDashing(): boolean;
  public isDebugThrough(): boolean;
  public isCollided(x: number, y: number): boolean;

  public centerX(): number;
  public centerY(): number;
  public center(x: number, y: number): void;
  public locate(x: number, y: number): void;

  public increaseSteps(): void;
  public makeEncounterCount(): void;
  public makeEncounterTroopId(): number;
  public meetsEncounterConditions(encounter: MZ.Map.Encounter): boolean;
  public executeEncounter(): boolean;

  public startMapEvent(x: number, y: number, triggers: number[], normal: boolean): void;
  public moveByInput(): void;
  public canMove(): boolean;
  public getInputDirection(): number;
  public executeMove(direction: number): void;

  public update(sceneActive?: boolean): void;
  public updateDashing(): void;
  public isDashButtonPressed(): boolean;
  public updateScroll(lastScrolledX: number, lastScrolledY: number): void;
  public updateVehicle(): void;
  public updateVehicleGetOn(): void;
  public updateVehicleGetOff(): void;
  public updateNonmoving(wasMoving: boolean): void;

  public triggerAction(): boolean;
  public triggerButtonAction(): boolean;
  public triggerTouchAction(): boolean;
  public triggerTouchActionD1(x1: number, y1: number): boolean;
  public triggerTouchActionD2(x2: number, y2: number): boolean;
  public triggerTouchActionD3(x2: number, y2: number): boolean;

  public updateEncounterCount(): void;
  public canEncounter(): boolean;
  public encounterProgressValue(): number;

  public checkEventTriggerHere(triggers: number[]): void;
  public checkEventTriggerThere(triggers: number[]): void;
  public checkEventTriggerTouch(x: number, y: number): void;

  public canStartLocalEvents(): boolean;

  public getOnOffVehicle(): boolean;
  public getOnVehicle(): boolean;
  public getOffVehicle(): boolean;

  public forceMoveForward(): void;
  public isOnDamageFloor(): boolean;
  public moveStraight(d: number): void;
  public moveDiagonally(horz: number, vert: number): void;
  public jump(xPlus: number, yPlus: number): void;

  public showFollowers(): void;
  public hideFollowers(): void;
  public gatherFollowers(): void;
  public areFollowersGathering(): boolean;
  public areFollowersGathered(): boolean;
}

//-----------------------------------------------------------------------------
/**
 * The game object class for a follower. A follower is an allied character,
 * other than the front character, displayed in the party.
 */
declare class Game_Follower extends Game_Character {
  public constructor(memberIndex: number);

  public _memberIndex: number;

  public initialize(...args: any[]): void;
  public refresh(): void;

  public actor(): Game_Actor;
  public isVisible(): boolean;
  public isGathered(): boolean;

  public update(): void;
  public chaseCharacter(character: Game_Character): void;
}

//-----------------------------------------------------------------------------
/**
 * The wrapper class for a follower array.
 */
declare class Game_Followers {
  public constructor();

  public _visible: boolean;
  public _gathering: boolean;
  public _data: Game_Follower[];

  public initialize(...args: any[]): void;

  public isVisible(): boolean;
  public show(): void;
  public hide(): void;
  public data(): Game_Follower[];
  public reverseData(): Game_Follower[];
  public follower(index: number): Game_Follower;

  public refresh(): void;
  public update(): void;
  public updateMove(): void;

  public jumpAll(): void;
  public synchronize(x: number, y: number, d: number): void;
  public gather(): void;
  public areGathering(): boolean;
  public visibleFollowers(): Game_Follower[];
  public areMoving(): boolean;
  public areGathered(): boolean;
  public isSomeoneCollided(x: number, y: number): boolean;
}

//-----------------------------------------------------------------------------
/**
 * The game object class for a vehicle.
 */
declare class Game_Vehicle extends Game_Character {
  public constructor(type: string);

  public _type: string;
  public _mapId: number;
  public _altitude: number;
  public _driving: boolean;
  public _bgm: MZ.AudioFile | null;

  public initialize(...args: any[]): void;
  public initMembers(): void;

  public isBoat(): boolean;
  public isShip(): boolean;
  public isAirship(): boolean;

  public resetDirection(): void;
  public initMoveSpeed(): void;
  public vehicle(): MZ.System.Vehicle | null;
  public loadSystemSettings(): void;

  public refresh(): void;

  public setLocation(mapId: number, x: number, y: number): void;
  public pos(x: number, y: number): boolean;
  public isMapPassable(x: number, y: number, d: number): boolean;

  public getOn(): void;
  public getOff(): void;
  public setBgm(bgm: MZ.AudioFile | null): void;
  public playBgm(): void;
  public syncWithPlayer(): void;

  public screenY(): number;
  public shadowX(): number;
  public shadowY(): number;
  public shadowOpacity(): number;

  public canMove(): boolean;

  public update(): void;
  public updateAirship(): void;
  public updateAirshipAltitude(): void;

  public maxAltitude(): number;
  public isLowest(): boolean;
  public isHighest(): boolean;
  public isTakeoffOk(): boolean;
  public isLandOk(x: number, y: number, d: number): boolean;
}

//-----------------------------------------------------------------------------
/**
 * The game object class for an event. It contains functionality for event page
 * switching and running parallel process events.
 */
declare class Game_Event extends Game_Character {
  public constructor(mapId: number, eventId: number);

  public _mapId: number;
  public _eventId: number;
  public _moveType: number;
  public _trigger: number | null;
  public _starting: boolean;
  public _erased: boolean;
  public _pageIndex: number;
  public _originalPattern: number;
  public _originalDirection: number;
  public _prelockDirection: number;
  public _locked: boolean;
  public _interpreter: Game_Interpreter | null;

  public initialize(...args: any[]): void;
  public initMembers(): void;

  public eventId(): number;
  public event(): MZ.Event;
  public page(): MZ.EventPage;
  public list(): MZ.EventCommand[];

  public isCollidedWithCharacters(x: number, y: number): boolean;
  public isCollidedWithEvents(x: number, y: number): boolean;
  public isCollidedWithPlayerCharacters(x: number, y: number): boolean;

  public lock(): void;
  public unlock(): void;

  public updateStop(): void;
  public updateSelfMovement(): void;

  public stopCountThreshold(): number;
  public moveTypeRandom(): void;
  public moveTypeTowardPlayer(): void;
  public isNearThePlayer(): boolean;
  public moveTypeCustom(): void;
  public isStarting(): boolean;
  public clearStartingFlag(): void;
  public isTriggerIn(triggers: number[]): boolean;

  public start(): void;
  public erase(): void;
  public refresh(): void;
  public findProperPageIndex(): number;
  public meetsConditions(page: MZ.EventPage): boolean;

  public setupPage(): void;
  public clearPageSettings(): void;
  public setupPageSettings(): void;

  public isOriginalPattern(): boolean;
  public resetPattern(): void;

  public checkEventTriggerTouch(x: number, y: number): void;
  public checkEventTriggerAuto(): void;

  public update(): void;
  public updateParallel(): void;

  public locate(x: number, y: number): void;
  public forceMoveRoute(moveRoute: MZ.MoveRoute): void;
}

//-----------------------------------------------------------------------------
/**
 * The interpreter for running event commands.
 */
declare class Game_Interpreter {
  public constructor(depth?: number);

  public _depth: number;
  public _branch: { [indent: number]: number | boolean | null };
  public _params: any[];
  public _indent: number;
  public _frameCount: number;
  public _freezeChecker: number;

  public _mapId: number;
  public _eventId: number;
  public _list: MZ.EventCommand[] | null;
  public _index: number;
  public _waitCount: number;
  public _waitMode: string;
  public _comments: string;
  public _characterId: number;
  public _childInterpreter: Game_Interpreter | null;

  public initialize(...args: any[]): void;
  public checkOverflow(): void;
  public clear(): void;
  public setup(list: MZ.EventCommand[], eventId?: number): void;
  public loadImages(): void;

  public eventId(): number;
  public isOnCurrentMap(): boolean;
  public setupReservedCommonEvent(): boolean;
  public isRunning(): boolean;

  public update(): void;
  public updateChild(): boolean;
  public updateWait(): boolean;
  public updateWaitCount(): boolean;
  public updateWaitMode(): boolean;

  public setWaitMode(waitMode: string): void;
  public wait(duration: number): void;
  public fadeSpeed(): number;

  public executeCommand(): boolean;
  public checkFreeze(): boolean;
  public terminate(): void;
  public skipBranch(): void;
  public currentCommand(): MZ.EventCommand;
  public nextEventCode(): number;

  public iterateActorId(param: number, callback: (actor: Game_Actor) => void): void;
  public iterateActorEx(param1: number, param2: number, callback: (actor: Game_Actor) => void): void;
  public iterateActorIndex(param: number, callback: (actor: Game_Actor) => void): void;
  public iterateEnemyIndex(param: number, callback: (enemy: Game_Enemy) => void): void;
  public iterateBattler(param1: number, param2: number, callback: (battler: Game_Battler) => void): void;
  public character(param: number): Game_Character | null;
  public operateValue(operation: number, operandType: number, operand: number): number;
  public changeHp(target: Game_Battler, value: number, allowDeath: boolean): void;

  /** Show Text */
  public command101(params: any[]): boolean;

  /** Show Choices */
  public command102(params: any[]): boolean;

  public setupChoices(params: [string[], number, number | undefined, number | undefined, number | undefined]): void;

  /** When [**] */
  public command402(params: any[]): boolean;

  /** When Cancel */
  public command403(): boolean;

  /** Input Number */
  public command103(params: any[]): boolean;

  public setupNumInput(params: [number, number]): void;

  /** Select Item */
  public command104(params: any[]): boolean;

  public setupItemChoice(params: [number, number | undefined]): void;

  /** Show Scrolling Text */
  public command105(params: any[]): boolean;

  /** Comment */
  public command108(params: any[]): boolean;

  /** Conditional Branch */
  public command111(params: any[]): boolean;

  /** Else */
  public command411(): boolean;

  /** Loop */
  public command112(): boolean;

  /** Repeat Above */
  public command413(): boolean;

  /** Break Loop */
  public command113(): boolean;

  /** Exit Event Processing */
  public command115(): boolean;

  /** Common Event */
  public command117(params: any[]): boolean;

  public setupChild(list: MZ.EventCommand[], eventId?: number): void;

  /** Label */
  public command118(): boolean;

  /** Jump to Label */
  public command119(params: any[]): boolean;

  public jumpTo(index: number): void;

  /** Control Switches */
  public command121(params: any[]): boolean;

  /** Control Variables */
  public command122(params: any[]): boolean;

  public gameDataOperand(type: number, param1: number, param2: number): number;
  public operateVariable(variableId: number, operationType: number, value: number): void;

  /** Control Self Switch */
  public command123(params: any[]): boolean;

  /** Control Timer */
  public command124(params: any[]): boolean;

  /** Change Gold */
  public command125(params: any[]): boolean;

  /** Change Items */
  public command126(params: any[]): boolean;

  /** Change Weapons */
  public command127(params: any[]): boolean;

  /** Change Armors */
  public command128(params: any[]): boolean;

  /** Change Party Member */
  public command129(params: any[]): boolean;

  /** Change Battle BGM */
  public command132(params: any[]): boolean;

  /** Change Victory ME */
  public command133(params: any[]): boolean;

  /** Change Save Access */
  public command134(params: any[]): boolean;

  /** Change Menu Access */
  public command135(params: any[]): boolean;

  /** Change Encounter Disable */
  public command136(params: any[]): boolean;

  /** Change Formation Access */
  public command137(params: any[]): boolean;

  /** Change Window Color */
  public command138(params: any[]): boolean;

  /** Change Defeat ME */
  public command139(params: any[]): boolean;

  /** Change Vehicle BGM */
  public command140(params: any[]): boolean;

  /** Transfer Player */
  public command201(params: any[]): boolean;

  /** Set Vehicle Location */
  public command202(params: any[]): boolean;

  /** Set Event Location */
  public command203(params: any[]): boolean;

  /** Scroll Map */
  public command204(params: any[]): boolean;

  /** Set Movement Route */
  public command205(params: any[]): boolean;

  /** Getting On and Off Vehicles */
  public command206(): boolean;

  /** Change Transparency */
  public command211(params: any[]): boolean;

  /** Show Animation */
  public command212(params: any[]): boolean;

  /** Show Balloon Icon */
  public command213(params: any[]): boolean;

  /** Erase Event */
  public command214(): boolean;

  /** Change Player Followers */
  public command216(params: any[]): boolean;

  /** Gather Followers */
  public command217(): boolean;

  /** Fadeout Screen */
  public command221(): boolean;

  /** Fadein Screen */
  public command222(): boolean;

  /** Tint Screen */
  public command223(params: any[]): boolean;

  /** Flash Screen */
  public command224(params: any[]): boolean;

  /** Shake Screen */
  public command225(params: any[]): boolean;

  /** Wait */
  public command230(params: any[]): boolean;

  /** Show Picture */
  public command231(params: any[]): boolean;

  /** Move Picture */
  public command232(params: any[]): boolean;

  public picturePoint(params: any[]): Point;

  /** Rotate Picture */
  public command233(params: any[]): boolean;

  /** Tint Picture */
  public command234(params: any[]): boolean;

  /** Erase Picture */
  public command235(params: any[]): boolean;

  /** Set Weather Effect */
  public command236(params: any[]): boolean;

  /** Play BGM */
  public command241(params: any[]): boolean;

  /** Fadeout BGM */
  public command242(params: any[]): boolean;

  /** Save BGM */
  public command243(): boolean;

  /** Resume BGM */
  public command244(): boolean;

  /** Play BGS */
  public command245(params: any[]): boolean;

  /** Fadeout BGS */
  public command246(params: any[]): boolean;

  /** Play ME */
  public command249(params: any[]): boolean;

  /** Play SE */
  public command250(params: any[]): boolean;

  /** Stop SE */
  public command251(): boolean;

  /** Play Movie */
  public command261(params: any[]): boolean;

  public videoFileExt(): string;

  /** Change Map Name Display */
  public command281(params: any[]): boolean;

  /** Change Tileset */
  public command282(params: any[]): boolean;

  /** Change Battle Back */
  public command283(params: any[]): boolean;

  /** Change Parallax */
  public command284(params: any[]): boolean;

  /** Get Location Info */
  public command285(params: any[]): boolean;

  /** Battle Processing */
  public command301(params: any[]): boolean;

  /** If Win */
  public command601(): boolean;

  /** If Escape */
  public command602(): boolean;

  /** If Lose */
  public command603(): boolean;

  /** Shop Processing */
  public command302(params: any[]): boolean;

  /** Name Input Processing */
  public command303(params: any[]): boolean;

  /** Change HP */
  public command311(params: any[]): boolean;

  /** Change MP */
  public command312(params: any[]): boolean;

  /** Change TP */
  public command326(params: any[]): boolean;

  /** Change State */
  public command313(params: any[]): boolean;

  /** Recover All */
  public command314(params: any[]): boolean;

  /** Change EXP */
  public command315(params: any[]): boolean;

  /** Change Level */
  public command316(params: any[]): boolean;

  /** Change Parameter */
  public command317(params: any[]): boolean;

  /** Change Skill */
  public command318(params: any[]): boolean;

  /** Change Equipment */
  public command319(params: any[]): boolean;

  /** Change Name */
  public command320(params: any[]): boolean;

  /** Change Class */
  public command321(params: any[]): boolean;

  /** Change Actor Images */
  public command322(params: any[]): boolean;

  /** Change Vehicle Image */
  public command323(params: any[]): boolean;

  /** Change Nickname */
  public command324(params: any[]): boolean;

  /** Change Profile */
  public command325(params: any[]): boolean;

  /** Change Enemy HP */
  public command331(params: any[]): boolean;

  /** Change Enemy MP */
  public command332(params: any[]): boolean;

  /** Change Enemy TP */
  public command342(params: any[]): boolean;

  /** Change Enemy State */
  public command333(params: any[]): boolean;

  /** Enemy Recover All */
  public command334(params: any[]): boolean;

  /** Enemy Appear */
  public command335(params: any[]): boolean;

  /** Enemy Transform */
  public command336(params: any[]): boolean;

  /** Show Battle Animation */
  public command337(params: any[]): boolean;

  /** Force Action */
  public command339(params: any[]): boolean;

  /** Abort Battle */
  public command340(): boolean;

  /** Open Menu Screen */
  public command351(): boolean;

  /** Open Save Screen */
  public command352(): boolean;

  /** Game Over */
  public command353(): boolean;

  /** Return to Title Screen */
  public command354(): boolean;

  /** Script */
  public command355(): boolean;

  /** Plugin Command MV (deprecated) */
  public command356(params: any[]): boolean;

  /** deprecated */
  public pluginCommand(): void;

  /** Plugin Command */
  public command357(params: any[]): boolean;
}
