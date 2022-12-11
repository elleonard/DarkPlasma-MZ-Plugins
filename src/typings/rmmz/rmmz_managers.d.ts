//=============================================================================
// rmmz_managers.js v1.6.0
//=============================================================================

declare var $dataActors: MZ.Actor[];
declare var $dataClasses: MZ.Class[];
declare var $dataSkills: MZ.Skill[];
declare var $dataItems: MZ.Item[];
declare var $dataWeapons: MZ.Weapon[];
declare var $dataArmors: MZ.Armor[];
declare var $dataEnemies: MZ.Enemy[];
declare var $dataTroops: MZ.Troop[];
declare var $dataStates: MZ.State[];
declare var $dataAnimations: MZ.Animation[];
declare var $dataTilesets: MZ.Tileset[];
declare var $dataCommonEvents: MZ.CommonEvent[];
declare var $dataSystem: MZ.System;
declare var $dataMapInfos: MZ.MapInfo[];
declare var $dataMap: MZ.Map | null;
declare var $gameTemp: Game_Temp;
declare var $gameSystem: Game_System;
declare var $gameScreen: Game_Screen;
declare var $gameTimer: Game_Timer;
declare var $gameMessage: Game_Message;
declare var $gameSwitches: Game_Switches;
declare var $gameVariables: Game_Variables;
declare var $gameSelfSwitches: Game_SelfSwitches;
declare var $gameActors: Game_Actors;
declare var $gameParty: Game_Party;
declare var $gameTroop: Game_Troop;
declare var $gameMap: Game_Map;
declare var $gamePlayer: Game_Player;
declare var $testEvent: MZ.EventCommand[] | null;
declare var $plugins: MZ.Plugin[];

//-----------------------------------------------------------------------------
/**
 * The static class that manages the database and game objects.
 */
type DatabaseNames = "$dataActors" |
"$dataClasses" |
"$dataSkills" |
"$dataItems" |
"$dataWeapons" |
"$dataArmors" |
"$dataEnemies" |
"$dataTroops" |
"$dataStates" |
"$dataAnimations" |
"$dataTilesets" |
"$dataCommonEvents" |
"$dataSystem" |
"$dataMapInfos";
declare class DataManager {
  private constructor();

  public static _globalInfo: DataManager.SaveFileInfo[] | null;
  public static _errors: DataManager.Error[];

  public static _databaseFiles: { name: DatabaseNames; src: string }[];

  public static loadGlobalInfo(): void;
  public static removeInvalidGlobalInfo(): void;
  public static saveGlobalInfo(): void;
  public static isGlobalInfoLoaded(): boolean;
  public static loadDatabase(): void;
  public static loadDataFile(name: string, src: string): void;
  public static onXhrLoad(xhr: XMLHttpRequest, name: string, src: string, url: string): void;
  public static onXhrError(name: string, src: string, url: string): void;
  public static isDatabaseLoaded(): boolean;
  public static loadMapData(mapId: number): void;
  public static makeEmptyMap(): void;
  public static isMapLoaded(): boolean;
  public static onLoad(object: any): void;
  public static isMapObject(object: any): boolean;
  public static extractArrayMetadata(array: DataManager.NoteHolder[]): void;
  public static extractMetadata(data: DataManager.NoteHolder): void;
  public static checkError(): void;

  public static isBattleTest(): boolean;
  public static isEventTest(): boolean;
  public static isSkill(item: DataManager.NoteHolder|null): item is MZ.Skill;
  public static isItem(item: DataManager.NoteHolder|null): item is MZ.Item;
  public static isWeapon(item: DataManager.NoteHolder|null): item is MZ.Weapon;
  public static isArmor(item: DataManager.NoteHolder|null): item is MZ.Armor;

  public static createGameObjects(): void;
  public static setupNewGame(): void;
  public static setupBattleTest(): void;
  public static setupEventTest(): void;

  public static isAnySavefileExists(): boolean;
  public static latestSavefileId(): number;
  public static earliestSavefileId(): number;
  public static emptySavefileId(): number;
  public static loadAllSavefileImages(): void;
  public static loadSavefileImages(info: DataManager.SaveFileInfo): void;
  public static maxSavefiles(): number;
  public static savefileInfo(): DataManager.SaveFileInfo;
  public static savefileExists(savefileId: number): boolean;
  public static saveGame(savefileId: number): Promise<number>;
  public static loadGame(savefileId: number): Promise<number>;
  public static makeSavename(savefileId: number): string;
  public static loadSavefileInfo(savefileId: number): DataManager.SaveFileInfo | null;
  public static lastAccessedSavefileId(): number;
  public static saveGameWithoutRescue(savefileId: number): boolean;
  public static loadGameWithoutRescue(savefileId: number): boolean;
  public static selectSavefileForNewGame(): void;
  public static makeSavefileInfo(): DataManager.SaveFileInfo;
  public static makeSaveContents(): DataManager.SaveContents;
  public static extractSaveContents(contents: DataManager.SaveContents): void;
  public static correctDataErrors(): void;
}

declare namespace DataManager {
  type NoteHolder = MZ.Actor | MZ.Class | MZ.Enemy | MZ.Item | MZ.Weapon | MZ.Armor | MZ.Skill | MZ.State | MZ.Map | MZ.Event | MZ.Tileset;
  type Item = MZ.Skill | MZ.Item | MZ.Weapon | MZ.Armor;
  type DrawableItem = Item | {iconIndex: number, name: string};
  type GlobalInfo = SaveFileInfo[];

  interface Error {
    name: string;
    src: string;
    url: string;
  }

  interface SaveFileInfo {
    globalId: string;
    title: string;
    characters: [string, number][];
    faces: [string, number][];
    playtime: string;
    timestamp: number;
  }

  interface SaveContents {
    system: Game_System;
    screen: Game_Screen;
    timer: Game_Timer;
    switches: Game_Switches;
    variables: Game_Variables;
    selfSwitches: Game_SelfSwitches;
    actors: Game_Actors;
    party: Game_Party;
    map: Game_Map;
    player: Game_Player;
  }
}

//-----------------------------------------------------------------------------
/**
 * The static class that manages the configuration data.
 */
declare class ConfigManager {
  private constructor();

  public static alwaysDash: boolean;
  public static commandRemember: boolean;
  public static touchUI: boolean;
  public static _isLoaded: boolean;
  public static bgmVolume: number;
  public static bgsVolume: number;
  public static meVolume: number;
  public static seVolume: number;

  public static load(): void;
  public static save(): void;
  public static isLoaded(): boolean;
  public static makeData(): ConfigManager.Config;
  public static applyData(config: ConfigManager.Config): void;
  public static readFlag(config: ConfigManager.Config, name: string): boolean;
  public static readVolume(config: ConfigManager.Config, name: string): number;
}

declare namespace ConfigManager {
  interface Config {
    alwaysDash: boolean;
    commandRemember: boolean;
    touchUI: boolean;
    bgmVolume: number;
    bgsVolume: number;
    meVolume: number;
    seVolume: number;
  }
}

//-----------------------------------------------------------------------------
/**
 * The static class that manages storage for saving game data.
 */
declare class StorageManager {
  private constructor();

  public static _forageKeys: string[];
  public static _forageKeysUpdated: boolean;

  public static isLocalMode(): boolean;

  public static saveObject(saveName: string, object: object): Promise<any>;
  public static loadObject(saveName: string): Promise<object>;

  public static objectToJson(object: object): Promise<string>;
  public static jsonToObject(json: string): Promise<object>;
  public static jsonToZip(json: string): Promise<string>;
  public static zipToJson(zip: string): Promise<string>;

  public static saveZip(saveName: string, zip: string): Promise<any>;
  public static loadZip(saveName: string): Promise<any>;

  public static exists(saveName: string): boolean;
  public static remove(saveName: string): void;

  public static saveToLocalFile(saveName: string, zip: string): Promise<void>;
  public static loadFromLocalFile(saveName: string): Promise<string>;
  public static localFileExists(saveName: string): boolean;
  public static removeLocalFile(saveName: string): void;

  public static saveToForage(saveName: string, zip: string): Promise<number>;
  public static loadFromForage(saveName: string): Promise<string>;
  public static forageExists(saveName: string): boolean;
  public static removeForage(saveName: string): Promise<number>;
  public static updateForageKeys(): Promise<number>;
  public static forageKeysUpdated(): boolean;

  public static fsMkdir(path: string): void;
  public static fsRename(oldPath: string, newPath: string): void;
  public static fsUnlink(path: string): void;
  public static fsReadFile(path: string): string | null;
  public static fsWriteFile(path: string, data: string): void;
  public static fsDirectoryPath(): string;
  public static filePath(saveName: string): string;

  public static forageKey(saveName: string): string;
  public static forageTestKey(): string;
}
//-----------------------------------------------------------------------------
/**
 * The static class that loads font files.
 */
declare class FontManager {
  private constructor();

  public static _urls: { [family: string]: string };
  public static _states: { [family: string]: string };

  public static load(family: string, filename: string): void;
  public static isReady(): boolean;
  public static startLoading(family: string, url: string): void;
  public static throwLoadError(family: string): void;
  public static makeUrl(filename: string): string;
}

//-----------------------------------------------------------------------------
/**
 * The static class that loads images, creates bitmap objects and retains them.
 */
declare class ImageManager {
  private constructor();

  public static iconWidth: number;
  public static iconHeight: number;
  public static faceWidth: number;
  public static faceHeight: number;

  public static _cache: { [url: string]: Bitmap };
  public static _system: { [url: string]: Bitmap };
  public static _emptyBitmap: Bitmap;

  public static loadAnimation(filename: string): Bitmap;
  public static loadBattleback1(filename: string): Bitmap;
  public static loadBattleback2(filename: string): Bitmap;
  public static loadEnemy(filename: string): Bitmap;
  public static loadCharacter(filename: string): Bitmap;
  public static loadFace(filename: string): Bitmap;
  public static loadParallax(filename: string): Bitmap;
  public static loadPicture(filename: string): Bitmap;
  public static loadSvActor(filename: string): Bitmap;
  public static loadSvEnemy(filename: string): Bitmap;
  public static loadSystem(filename: string): Bitmap;
  public static loadTileset(filename: string): Bitmap;
  public static loadTitle1(filename: string): Bitmap;
  public static loadTitle2(filename: string): Bitmap;

  public static loadBitmap(folder: string, filename: string): Bitmap;
  public static loadBitmapFromUrl(url: string): Bitmap;
  public static clear(): void;

  public static isReady(): boolean;
  public static throwLoadError(bitmap: Bitmap): void;
  public static isObjectCharacter(filename: string): boolean;
  public static isBigCharacter(filename: string): boolean;
  public static isZeroParallax(filename: string): boolean;
}
//-----------------------------------------------------------------------------
/**
 * The static class that loads Effekseer effects.
 */
declare class EffectManager {
  private constructor();

  public static _cache: { [url: string]: effekseer.EffekseerEffect };
  public static _errorUrls: string[];

  public static load(filename: string): effekseer.EffekseerEffect | null;
  public static startLoading(url: string): effekseer.EffekseerEffect;
  public static clear(): void;

  public static onLoad(): void;
  public static onError(): void;
  public static makeurl(filename: string): string;
  public static checkErrors(): void;
  public static throwLoadError(url: string): void;
  public static isReady(): boolean;
}

//-----------------------------------------------------------------------------
/**
 * The static class that handles BGM, BGS, ME and SE.
 */
declare class AudioManager {
  private constructor();

  public static _bgmVolume: number;
  public static _bgsVolume: number;
  public static _meVolume: number;
  public static _seVolume: number;
  public static _currentBgm: AudioManager.AudioState | null;
  public static _currentBgs: AudioManager.AudioState | null;
  public static _bgmBuffer: WebAudio | null;
  public static _bgsBuffer: WebAudio | null;
  public static _meBuffer: WebAudio | null;
  public static _seBuffers: WebAudio[];
  public static _staticBuffers: WebAudio[];
  public static _replayFadeTime: number;
  public static _path: string;

  public static bgmVolume: number;
  public static bgsVolume: number;
  public static meVolume: number;
  public static seVolume: number;

  public static playBgm(bgm: MZ.AudioFile, pos?: number): void;
  public static replayBgm(bgm: AudioManager.AudioState): void;
  public static isCurrentBgm(bgm: MZ.AudioFile): boolean;
  public static updateBgmParameters(bgm: MZ.AudioFile): void;
  public static updateCurrentBgm(bgm: MZ.AudioFile, pos?: number): void;
  public static stopBgm(): void;
  public static fadeOutBgm(duration: number): void;
  public static fadeInBgm(duration: number): void;

  public static playBgs(bgs: MZ.AudioFile, pos?: number): void;
  public static replayBgs(bgs: AudioManager.AudioState): void;
  public static isCurrentBgs(bgs: MZ.AudioFile): boolean;
  public static updateBgsParameters(bgs: MZ.AudioFile): void;
  public static updateCurrentBgs(bgs: MZ.AudioFile, pos?: number): void;
  public static stopBgs(): void;
  public static fadeOutBgs(duration: number): void;
  public static fadeInBgs(duration: number): void;

  public static playMe(me: MZ.AudioFile): void;
  public static updateMeParameters(me: MZ.AudioFile): void;
  public static fadeOutMe(duration: number): void;
  public static stopMe(): void;

  public static playSe(se: MZ.AudioFile): void;
  public static updateSeParameters(buffer: WebAudio, se: MZ.AudioFile): void;
  public static cleanupSe(): void;
  public static stopSe(): void;
  public static playStaticSe(se: MZ.AudioFile): void;
  public static loadStaticSe(se: MZ.AudioFile): void;
  public static isStaticSe(se: MZ.AudioFile): boolean;

  public static stopAll(): void;
  public static saveBgm(): AudioManager.AudioState;
  public static saveBgs(): AudioManager.AudioState;
  public static makeEmptyAudioObject(): AudioManager.AudioState;
  public static createBuffer(folder: string, name: string): WebAudio;
  public static updateBufferParameters(buffer: WebAudio, configVolume: number, audio: MZ.AudioFile): void;
  public static audioFileExt(): string;
  public static checkErrors(): void;
  public static throwLoadError(): void;
}

declare namespace AudioManager {
  interface AudioState extends MZ.AudioFile {
    name: string;
    volume: number;
    pitch: number;
    pan: number;
    pos: number;
  }
}

//-----------------------------------------------------------------------------
/**
 * The static class that plays sound effects defined in the database.
 */
declare class SoundManager {
  private constructor();

  public static preloadImportantSounds(): void;
  public static loadSystemSound(n: number): void;
  public static playSystemSound(n: number): void;

  public static playCursor(): void;
  public static playOk(): void;
  public static playCancel(): void;
  public static playBuzzer(): void;
  public static playEquip(): void;
  public static playSave(): void;
  public static playLoad(): void;
  public static playBattleStart(): void;
  public static playEscape(): void;
  public static playEnemyAttack(): void;
  public static playEnemyDamage(): void;
  public static playEnemyCollapse(): void;
  public static playBossCollapse1(): void;
  public static playBossCollapse2(): void;
  public static playActorDamage(): void;
  public static playActorCollapse(): void;
  public static playRecovery(): void;
  public static playMiss(): void;
  public static playEvasion(): void;
  public static playMagicEvasion(): void;
  public static playReflection(): void;
  public static playShop(): void;
  public static playUseItem(): void;
  public static playUseSkill(): void;
}

//-----------------------------------------------------------------------------
/**
 * The static class that handles terms and messages.
 */
declare class TextManager {
  private constructor();

  public static basic(basicId: number): string;
  public static param(paramId: number): string;
  public static command(commandId: number): string;
  public static message(messageId: string): string;

  public static getter(method: string, param: number | string): PropertyDescriptor;

  public static readonly currencyUnit: string;

  public static readonly level: string;
  public static readonly levelA: string;
  public static readonly hp: string;
  public static readonly hpA: string;
  public static readonly mp: string;
  public static readonly mpA: string;
  public static readonly tp: string;
  public static readonly tpA: string;
  public static readonly exp: string;
  public static readonly expA: string;
  public static readonly fight: string;
  public static readonly escape: string;
  public static readonly attack: string;
  public static readonly guard: string;
  public static readonly item: string;
  public static readonly skill: string;
  public static readonly equip: string;
  public static readonly status: string;
  public static readonly formation: string;
  public static readonly save: string;
  public static readonly gameEnd: string;
  public static readonly options: string;
  public static readonly weapon: string;
  public static readonly armor: string;
  public static readonly keyItem: string;
  public static readonly equip2: string;
  public static readonly optimize: string;
  public static readonly clear: string;
  public static readonly newGame: string;
  public static readonly continue_: string;
  public static readonly toTitle: string;
  public static readonly cancel: string;
  public static readonly buy: string;
  public static readonly sell: string;
  public static readonly alwaysDash: string;
  public static readonly commandRemember: string;
  public static readonly touchUI: string;
  public static readonly bgmVolume: string;
  public static readonly bgsVolume: string;
  public static readonly meVolume: string;
  public static readonly seVolume: string;
  public static readonly possession: string;
  public static readonly expTotal: string;
  public static readonly expNext: string;
  public static readonly saveMessage: string;
  public static readonly loadMessage: string;
  public static readonly file: string;
  public static readonly partyName: string;
  public static readonly emerge: string;
  public static readonly preemptive: string;
  public static readonly surprise: string;
  public static readonly escapeStart: string;
  public static readonly escapeFailure: string;
  public static readonly victory: string;
  public static readonly defeat: string;
  public static readonly obtainExp: string;
  public static readonly obtainGold: string;
  public static readonly obtainItem: string;
  public static readonly levelUp: string;
  public static readonly obtainSkill: string;
  public static readonly useItem: string;
  public static readonly criticalToEnemy: string;
  public static readonly criticalToActor: string;
  public static readonly actorDamage: string;
  public static readonly actorRecovery: string;
  public static readonly actorGain: string;
  public static readonly actorLoss: string;
  public static readonly actorDrain: string;
  public static readonly actorNoDamage: string;
  public static readonly actorNoHit: string;
  public static readonly enemyDamage: string;
  public static readonly enemyRecovery: string;
  public static readonly enemyGain: string;
  public static readonly enemyLoss: string;
  public static readonly enemyDrain: string;
  public static readonly enemyNoDamage: string;
  public static readonly enemyNoHit: string;
  public static readonly evasion: string;
  public static readonly magicEvasion: string;
  public static readonly magicReflection: string;
  public static readonly counterAttack: string;
  public static readonly substitute: string;
  public static readonly buffAdd: string;
  public static readonly debuffAdd: string;
  public static readonly buffRemove: string;
  public static readonly actionFailure: string;
}
//-----------------------------------------------------------------------------
/**
 * The static class that handles the window colors.
 */
declare class ColorManager {
  private constructor();

  public static _windowskin: Bitmap;

  public static loadWindowskin(): void;
  public static textColor(n: number): string;
  public static normalColor(): string;
  public static systemColor(): string;
  public static crisisColor(): string;
  public static deathColor(): string;
  public static gaugeBackColor(): string;
  public static hpGaugeColor1(): string;
  public static hpGaugeColor2(): string;
  public static mpGaugeColor1(): string;
  public static mpGaugeColor2(): string;
  public static mpCostColor(): string;
  public static powerUpColor(): string;
  public static powerDownColor(): string;
  public static ctGaugeColor1(): string;
  public static ctGaugeColor2(): string;
  public static tpGaugeColor1(): string;
  public static tpGaugeColor2(): string;
  public static tpCostColor(): string;
  public static pendingColor(): string;
  public static hpColor(actor: Game_Actor): string;
  public static mpColor(): string;
  public static tpColor(): string;
  public static paramchangeTextColor(change: number): string;
  public static damageColor(colorType: number): string;
  public static outlineColor(): string;
  public static dimColor1(): string;
  public static dimColor2(): string;
  public static itemBackColor1(): string;
  public static itemBackColor2(): string;
}

//-----------------------------------------------------------------------------
/**
 * The static class that manages scene transitions.
 */
declare const SceneManager: SceneManager;
declare interface SceneManager extends GenericSceneManager<Scene_Base> {}

declare interface GenericSceneManager<T extends Stage> {
  /*
   * Gets the current time in ms.
   * @private
   */
  _getTimeInMs(): number;

  _scene: T | null;
  _nextScene: T | null;
  _stack: SceneManager.SceneConstructor<T>[];
  _exiting: boolean;
  _previousScene: T | null;
  _previousClass: SceneManager.SceneConstructor<T> | null;
  _backgroundBitmap: Bitmap | null;
  _smoothDeltaTime: number;
  _elapsedTime: number;

  run(sceneClass: SceneManager.SceneConstructor<T>): void;
  initialize(): void;
  checkBrowser(): void;
  checkPluginErrors(): void;
  initGraphics(): void;
  initAudio(): void;
  initVideo(): void;
  initInput(): void;
  setupEventHandlers(): void;

  update(): void;
  determineRepeatNumber(deltaTime: number): number;
  terminate(): void;
  onError(e: Error): void;
  onReject(event: PromiseRejectionEvent): void;
  onUnload(): void;
  onKeyDown(event: KeyboardEvent): void;
  reloadGame(): void;
  showDevTools(): void;
  catchException(e: Error): void;
  catchNormalError(e: Error): void;
  catchLoadError(e: Error): void;
  catcuUnknownError(e: any): void;

  updateMain(): void;
  updateFrameCount(): void;
  updateInputData(): void;
  updateEffekseer(): void;

  changeScene(): void;
  updateScene(): void;

  isGameActive(): boolean;

  onSceneTerminate(): void;
  onSceneCreate(): void;
  onBeforeSceneStart(): void;
  onSceneStart(): void;

  isSceneChanging(): boolean;
  isCurrentSceneBusy(): boolean;
  isNextScene(sceneClass: SceneManager.SceneConstructor<T>): boolean;
  isPreviousScene(sceneClass: SceneManager.SceneConstructor<T>): boolean;

  goto(sceneClass: SceneManager.SceneConstructor<T>): void;
  push(sceneClass: SceneManager.SceneConstructor<T>): void;
  pop(): void;
  exit(): void;
  clearStack(): void;
  stop(): void;
  prepareNextScene(...args: any[]): void;
  snap(): Bitmap;
  snapForBackground(): void;
  backgroundBitmap(): Bitmap | null;
  resume(): void;
}

declare namespace SceneManager {
  interface SceneConstructor<T> {
    prototype: Stage;
    new (): T;
  }
}

//-----------------------------------------------------------------------------
/**
 * The static class that manages battle progress.
 */
declare const BattleManager: BattleManager;
declare interface BattleManager extends GenericBattleManager<Game_Battler, Game_Actor, Game_Action, MZ.Item|MZ.Weapon|MZ.Armor> {}

declare interface GenericBattleManager<Battler, Actor extends Battler, Action, Item> {
  _phase: number;
  _inputting: boolean;
  _canEscape: boolean;
  _canLose: boolean;
  _battleTest: boolean;
  _eventCallback: BattleManager.Callback | null;
  _preemptive: boolean;
  _surprise: boolean;
  _currentActor: Actor | null;
  _actionForcedBattler: Battler | null;
  _mapBgm: AudioManager.AudioState | null;
  _mapBgs: AudioManager.AudioState | null;
  _actionBattlers: Battler[];
  _subject: Battler | null;
  _action: Action | null;
  _targets: Battler[];
  _logWindow: BattleManager.LogWindow<Battler, Action> | null;
  _spriteset: BattleManager.Spriteset | null;
  _escapeRatio: number;
  _escaped: boolean;
  _rewards: BattleManager.Reward<Item>;
  _tpbNeedsPartyCommand: boolean;

  setup(troopId: number, canEscape: boolean, canLose: boolean): void;
  initMembers(): void;
  isTpb(): boolean;
  isActiveTpb(): boolean;
  isBattleTest(): boolean;
  setBattleTest(battleTest: boolean): void;
  setEventCallback(callback: BattleManager.Callback | null): void;
  setLogWindow(logWindow: BattleManager.LogWindow<Battler, Action> | null): void;
  setSpriteset(spriteset: BattleManager.Spriteset | null): void;

  onEncounter(): void;
  ratePreemptive(): number;
  rateSurprise(): number;

  saveBgmAndBgs(): void;
  playBattleBgm(): void;
  playVictoryMe(): void;
  playDefeatMe(): void;
  replayBgmAndBgs(): void;

  makeEscapeRatio(): void;

  update(timeActive: boolean): void;
  updatePhase(timeActive: boolean): void;
  updateEvent(): boolean;
  updateEventMain(): boolean;

  isBusy(): boolean;

  updateTpbInput(): void;
  checkTpbInputClose(): void;
  checkTpbInputOpen(): void;
  isPartyTpbInputtable(): boolean;
  needsActorInputCancel(): boolean;
  isTpbMainPhase(): boolean;

  isInputting(): boolean;
  isInTurn(): boolean;
  isTurnEnd(): boolean;
  isAborting(): boolean;
  isBattleEnd(): boolean;
  canEscape(): boolean;
  canLose(): boolean;
  isEscaped(): boolean;

  actor(): Actor | null;

  startBattle(): void;
  displayStartMessages(): void;
  startInput(): void;
  inputtingAction(): Action | null;
  selectNextCommand(): void;
  selectNextActor(): void;
  selectPreviousCommand(): void;
  selectPreviousActor(): void;
  changeCurrentActor(): void;
  startActorInput(): void;
  finishActorInput(): void;
  cancelActorInput(): void;

  updateStart(): void;

  startTurn(): void;
  updateTurn(): void;
  updateTpb(): void;
  updateAllTpbBattler(): void;
  updateTpbBattler(): void;
  cehckTpbTurnEnd(): void;
  processTurn(): void;
  endBattlerActions(battler: Battler): void;
  endTurn(): void;
  endAllBattlersTurn(): void;
  displayBattlerStatus(battler: Battler, current: boolean): void;
  updateTurnEnd(): void;

  getNextSubject(): Battler | null;
  allBattleMembers(): Battler[];
  makeActionOrders(): void;

  startAction(): void;
  updateAction(): void;
  endAction(): void;
  invokeAction(subject: Battler, target: Battler): void;
  invokeNormalAction(subject: Battler, target: Battler): void;
  invokeCounterAttack(subject: Battler, target: Battler): void;
  invokeMagicReflection(subject: Battler, target: Battler): void;
  applySubstitute(target: Battler): Battler;
  checkSubstitute(target: Battler): boolean;
  isActionForced(): boolean;
  forceAction(battler: Battler): void;
  processForcedAction(): void;

  abort(): void;
  checkBattleEnd(): boolean;
  checkAbort(): boolean;
  processVictory(): void;
  processEscape(): boolean;
  onEscapeSuccess(): void;
  onEscapeFailure(): void;
  processAbort(): void;
  processDefeat(): void;
  endBattle(result: number): void;
  updateBattleEnd(): void;
  makeRewards(): void;

  displayVictoryMessage(): void;
  displayDefeatMessage(): void;
  displayEscapeSuccessMessage(): void;
  displayEscapeFailureMessage(): void;
  displayRewards(): void;
  displayExp(): void;
  displayGold(): void;
  displayDropItems(): void;

  gainRewards(): void;
  gainExp(): void;
  gainGold(): void;
  gainDropItems(): void;
}

declare namespace BattleManager {
  type Callback = (result: number) => void;

  interface LogWindow<Battler, Action> {
    isBusy(): boolean;
    push(methodName: string, ...args: any[]): void;
    startTurn(): void;
    startAction(subject: Battler, action: Action, targets: Battler[]): void;
    endAction(subject: Battler): void;
    displayAutoAffectedStatus(subject: Battler): void;
    displayCurrentState(subject: Battler): void;
    displayRegeneration(subject: Battler): void;
    displayCounter(target: Battler): void;
    displayReflection(target: Battler): void;
    displaySubstitute(substitute: Battler, target: Battler): void;
    displayActionResults(subject: Battler, target: Battler): void;
  }

  interface Spriteset {
    isBusy(): boolean;
  }

  interface Reward<Item> {
    gold: number;
    exp: number;
    items: Item[];
  }
}

//-----------------------------------------------------------------------------
/**
 * The static class that manages the plugins.
 */
declare class PluginManager {
  private constructor();

  public static _scripts: string[];
  public static _errorUrls: string[];
  public static _parameters: { [name: string]: string };
  public static _commands: { [key: string]: Function };

  public static setup(plugins: MZ.Plugin[]): void;
  public static parameters(name: string): { [name: string]: string };
  public static setParameters(name: string, parameters: { [name: string]: string }): void;
  public static loadScript(name: string): void;
  public static onError(e: Error): void;
  public static makeUrl(filename: string): string;
  public static checkErrors(): void;
  public static throwLoadError(): void;
  public static registerCommand(pluginName: string, commandName: string, func: (args: {[key: string]: string|true}) => void): void;
  public static callCommand(self: Game_Interpreter, pluginName: string, commandName: string, args: any): void;
}
