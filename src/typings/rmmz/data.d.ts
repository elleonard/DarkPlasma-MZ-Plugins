declare namespace MZ {
  interface Actor {
    battleName: string;
    characterIndex: number;
    characterName: string;
    classId: number;
    equips: number[];
    faceIndex: number;
    faceName: string;
    id: number;
    initialLevel: number;
    maxLevel: number;
    meta: Metadata;
    name: string;
    nickname: string;
    note: string;
    profile: string;
    traits: Trait[];
  }

  interface Animation {
    displayType: number;
    effectName: string;
    flashTimings: Animation.FlashTiming[];
    id: number;
    name: string;
    offsetX: number;
    offsetY: number;
    rotation: Animation.Rotation;
    scale: number;
    soundTimings: Animation.SoundTiming[];
    speed: number;
  }

  namespace Animation {
    interface FlashTiming {
      color: number[];
      duration: number;
      frame: number;
    }

    interface SoundTiming {
      frame: number;
      se: AudioFile;
    }

    interface Rotation {
      x: number;
      y: number;
      z: number;
    }
  }

  interface AnimationMV {
    animation1Hue: number;
    animation1Name: string;
    animation2Hue: number;
    animation2Name: string;
    frames: number[][][];
    id: number;
    name: string;
    position: number;
    timings: AnimationMV.Timing[];
  }

  namespace AnimationMV {
    interface Timing {
      flashColor: number[];
      flashDuration: number;
      flashScope: number;
      frame: number;
      se: AudioFile;
    }
  }

  interface Armor {
    atypeId: number;
    description: string;
    etypeId: number;
    iconIndex: number;
    id: number;
    meta: Metadata;
    name: string;
    note: string;
    params: number[];
    price: number;
    traits: Trait[];
  }

  interface AudioFile {
    name: string;
    pan: number;
    pitch: number;
    volume: number;
  }

  interface BattleEventPage {
    conditions: BattleEventPage.Conditions;
    list: EventCommand[];
    span: number;
  }

  namespace BattleEventPage {
    interface Conditions {
      actorHp: number;
      actorId: number;
      actorValid: boolean;
      enemyHp: number;
      enemyIndex: number;
      enemyValid: boolean;
      switchId: number;
      switchValid: boolean;
      turnA: number;
      turnB: number;
      turnEnding: boolean;
      turnValid: boolean;
    }
  }

  interface Class {
    expParams: number[];
    id: number;
    learnings: Class.Learning[];
    meta: Metadata;
    name: string;
    note: string;
    params: number[][];
    traits: Trait[];
  }

  namespace Class {
    interface Learning {
      level: number;
      note: string;
      skillId: number;
    }
  }

  interface CommonEvent {
    id: number;
    list: EventCommand[];
    name: string;
    switchId: number;
    trigger: number;
  }

  interface Damage {
    critical: boolean;
    elementId: number;
    formula: string;
    type: number;
    variance: number;
  }

  interface Effect {
    code: number;
    dataId: number;
    value1: number;
    value2: number;
  }

  interface Enemy {
    actions: Enemy.Action[];
    battlerHue: number;
    battlerName: string;
    dropItems: Enemy.DropItem[];
    exp: number;
    gold: number;
    id: number;
    meta: Metadata;
    name: string;
    note: string;
    params: number[];
    traits: Trait[];
  }

  namespace Enemy {
    interface Action {
      conditionParam1: number;
      conditionParam2: number;
      conditionType: number;
      rating: number;
      skillId: number;
    }

    interface DropItem {
      dataId: number;
      denominator: number;
      kind: number;
    }
  }

  interface Event {
    id: number;
    meta: Metadata;
    name: string;
    note: string;
    pages: EventPage[];
    x: number;
    y: number;
  }

  interface EventCommand {
    code: number;
    indent: number;
    parameters: any[];
  }

  interface EventPage {
    conditions: EventPage.Conditions;
    directionFix: boolean;
    image: EventPage.Image;
    list: EventCommand[];
    moveFrequency: number;
    moveRoute: MoveRoute;
    moveSpeed: number;
    moveType: number;
    priorityType: number;
    stepAnime: boolean;
    through: boolean;
    trigger: number;
    walkAnime: boolean;
  }

  namespace EventPage {
    interface Conditions {
      actorId: number;
      actorValid: boolean;
      itemId: number;
      itemValid: boolean;
      selfSwitchCh: string;
      selfSwitchValid: boolean;
      switch1Id: number;
      switch1Valid: boolean;
      switch2Id: number;
      switch2Valid: boolean;
      variableId: number;
      variableValid: boolean;
      variableValue: number;
    }

    interface Image {
      characterIndex: number;
      characterName: string;
      direction: number;
      pattern: number;
      tileId: number;
    }
  }

  interface Item {
    animationId: number;
    consumable: boolean;
    damage: Damage;
    description: string;
    effects: Effect[];
    hitType: number;
    iconIndex: number;
    id: number;
    itypeId: number;
    meta: Metadata;
    name: string;
    note: string;
    occasion: number;
    price: number;
    repeats: number;
    scope: number;
    speed: number;
    successRate: number;
    tpGain: number;
  }

  interface Map {
    autoplayBgm: boolean;
    autoplayBgs: boolean;
    battleback1Name: string;
    battleback2Name: string;
    bgm: AudioFile;
    bgs: AudioFile;
    data: number[];
    disableDashing: boolean;
    displayName: string;
    encounterList: Map.Encounter[];
    encounterStep: number;
    events: Event[];
    height: number;
    meta: Metadata;
    note: string;
    parallaxLoopX: boolean;
    parallaxLoopY: boolean;
    parallaxName: string;
    parallaxShow: boolean;
    parallaxSx: number;
    parallaxSy: number;
    scrollType: number;
    specifyBattleback: boolean;
    tilesetId: number;
    width: number;
  }

  namespace Map {
    interface Encounter {
      regionSet: number[];
      troopId: number;
      weight: number;
    }
  }

  interface MapInfo {
    expanded: boolean;
    name: string;
    order: number;
    parentId: number;
    scrollX: boolean;
    scrollY: boolean;
  }

  interface MoveCommand {
    code: number;
    parameters?: any[];
  }

  interface MoveRoute {
    list: MoveCommand[];
    repeat: boolean;
    skippable: boolean;
    wait: boolean;
  }

  interface Skill {
    animationId: number;
    damage: Damage;
    description: string;
    effects: Effect[];
    hitType: number;
    iconIndex: number;
    id: number;
    message1: string;
    message2: string;
    meta: Metadata;
    mpCost: number;
    name: string;
    note: string;
    occasion: number;
    repeats: number;
    requiredWtypeId1: number;
    requiredWtypeId2: number;
    scope: number;
    speed: number;
    stypeId: number;
    successRate: number;
    tpCost: number;
    tpGain: number;
  }

  interface State {
    autoRemovalTiming: number;
    chanceByDamage: number;
    iconIndex: number;
    id: number;
    maxTurns: number;
    message1: string;
    message2: string;
    message3: string;
    message4: string;
    meta: Metadata;
    minTurns: number;
    motion: number;
    name: string;
    note: string;
    overlay: number;
    priority: number;
    removeAtBattleEnd: boolean;
    removeByDamage: boolean;
    removeByRestriction: boolean;
    removeByWalking: boolean;
    restriction: number;
    stepsToRemove: number;
    traits: Trait[];
  }

  interface System {
    advanced: System.Advanced;
    airship: System.Vehicle;
    armorTypes: string[];
    attackMotions: System.AttackMotion[];
    battleback1Name: string;
    battleback2Name: string;
    battleBgm: AudioFile;
    battlerHue: number;
    battlerName: string;
    battleSystem: number;
    boat: System.Vehicle;
    currencyUnit: string;
    defeatMe: AudioFile;
    editMapId: number;
    elements: string[];
    equipTypes: string[];
    gameoverMe: AudioFile;
    gameTitle: string;
    itemCategories: boolean[];
    locale: string;
    magicSkills: number[];
    menuCommands: boolean[];
    optAutosave: boolean;
    optDisplayTp: boolean;
    optDrawTitle: boolean;
    optExtraExp: boolean;
    optFloorDeath: boolean;
    optFollowers: boolean;
    optKeyItemsNumber: boolean;
    optSideView: boolean;
    optSlipDeath: boolean;
    optTransparent: boolean;
    partyMembers: number[];
    ship: System.Vehicle;
    skillTypes: string[];
    sounds: AudioFile[];
    startMapId: number;
    startX: number;
    startY: number;
    switches: string[];
    terms: System.Terms;
    testBattlers: System.TestBattler[];
    testTroopId: number;
    title1Name: string;
    title2Name: string;
    titleBgm: AudioFile;
    titleCommandWindow: System.TitleCommandWindow;
    variables: string[];
    versionId: number;
    victoryMe: AudioFile;
    weaponTypes: string[];
    windowTone: number[];
  }

  namespace System {
    interface Advanced {
      gameId: number;
      screenWidth: number;
      screenHeight: number;
      uiAreaWidth: number;
      uiAreaHeight: number;
      numberFonrFilename: string;
      fallbackFonts: string;
      fontSize: number;
      mainFontFilename: string;
    }

    interface AttackMotion {
      type: number;
      weaponImageId: number;
    }

    interface TitleCommandWindow {
      background: number;
      offsetX: number;
      offsetY: number;
    }

    interface Terms {
      basic: string[];
      commands: string[];
      messages: Terms.Messages;
      params: string[];
    }

    namespace Terms {
      interface Messages {
        actionFailure: string;
        actorDamage: string;
        actorDrain: string;
        actorGain: string;
        actorLoss: string;
        actorNoDamage: string;
        actorNoHit: string;
        actorRecovery: string;
        alwaysDash: string;
        autosave: string;
        bgmVolume: string;
        bgsVolume: string;
        buffAdd: string;
        buffRemove: string;
        commandRemember: string;
        counterAttack: string;
        criticalToActor: string;
        criticalToEnemy: string;
        debuffAdd: string;
        defeat: string;
        emerge: string;
        enemyDamage: string;
        enemyDrain: string;
        enemyGain: string;
        enemyLoss: string;
        enemyNoDamage: string;
        enemyNoHit: string;
        enemyRecovery: string;
        escapeFailure: string;
        escapeStart: string;
        evasion: string;
        expNext: string;
        expTotal: string;
        file: string;
        levelUp: string;
        loadMessage: string;
        magicEvasion: string;
        magicReflection: string;
        meVolume: string;
        obtainExp: string;
        obtainGold: string;
        obtainItem: string;
        obtainSkill: string;
        partyName: string;
        possession: string;
        preemptive: string;
        saveMessage: string;
        seVolume: string;
        substitute: string;
        surprise: string;
        touchUI: string;
        useItem: string;
        victory: string;
      }
    }

    interface TestBattler {
      actorid: number;
      equips: number[];
      level: number;
    }

    interface Vehicle {
      bgm: AudioFile;
      characterIndex: number;
      characterName: string;
      startMapId: number;
      startX: number;
      startY: number;
    }
  }

  interface Tileset {
    flags: number[];
    id: number;
    meta: Metadata;
    mode: number;
    name: string;
    note: string;
    tilesetNames: string[];
  }

  interface Trait {
    code: number;
    dataId: number;
    value: number;
  }

  interface Troop {
    id: number;
    members: Troop.Member[];
    name: string;
    pages: BattleEventPage[];
  }

  namespace Troop {
    interface Member {
      enemyId: number;
      hidden: boolean;
      x: number;
      y: number;
    }
  }

  interface Weapon {
    animationId: number;
    description: string;
    etypeId: number;
    iconIndex: number;
    id: number;
    meta: Metadata;
    name: string;
    note: string;
    params: number[];
    price: number;
    traits: Trait[];
    wtypeId: number;
  }

  interface Plugin {
    name: string;
    status: boolean;
    description: string;
    parameters: { [name: string]: string };
  }

  type Metadata = { [name: string]: string | true };
}
