/**
 * version
 *   TorigoyaMZ_FrameTween.js: 2.2.1
 *   TorigoyaMZ_SkillCutIn.js: 1.4.0
 */
declare namespace Torigoya {
  namespace SkillCutIn {
    declare interface CutInManagerClass {
      getConfigByActor(actor: Game_Actor, item: MZ.Skill|MZ.Item): ActorConfig[];
      setParameter(config: SkillCutInConfig, isEnemy: boolean): void;
      canPlayConfig(config: SkillCutInConfig, subject: Game_Actor|Game_Enemy): boolean;
    }
    type CustomizedColor = {
      isUse: boolean;
      red: number;
      green: number;
      blue: number;
    };
    type Sound = {
      name: string;
      volume: number;
      pitch: number;
      pan: number;
    };
    type SkillCutInConfig = ActorConfig;
    type ActorConfig = {
      base: string;
      actorId: number;
      skillId: number;
      render: string;
      picture: string;
      pictureX: number;
      pictureY: number;
      pictureScale: number;
      advanced: string;
      backColor1: string;
      backColor2: string;
      backTone: CustomizedColor;
      borderTone: CustomizedColor;
      backImage1: string;
      backImage2: string;
      borderImage: string;
      borderBlendMode: string;
      sound: Sound;
      note: string;
    };
    const parameter: {
      actorConfig: ActorConfig[];
    };
    const CutInManager: CutInManagerClass;
    class Sprite_CutInBase { }
    class Sprite_CutInWoss { }
  }
}

declare interface BattleManager {
  torigoyaSkillCutIn_playCutIn(): void;
}
