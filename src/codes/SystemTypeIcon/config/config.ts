import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import { createStruct, createNumberParam, createStructParam, createIconArrayParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2024/01/15",
    version: "1.1.1",
    description: "ビルド方式を変更 (configをTypeScript化)",
  },
  {
    date: "2023/09/10",
    version: "1.1.0",
    description: "武器タイプアイコン、防具タイプアイコンを追加",
  },
  {
    date: "2023/03/18",
    version: "1.0.0",
    description: "公開",
  },
];

const structDebuffStatusIcon = createStruct(
  "DebuffStatusIcon",
  [
    createNumberParam(
      "small",
      {
        text: {
          ja: "弱体アイコン（小）",
          en: "Debuff status icon Lv1.",
        },
      }
    ),
    createNumberParam(
      "large",
      {
        text: {
          ja: "弱体アイコン（大）",
          en: "Debuff status icon Lv2.",
        },
      }
    ),
  ]
);

const structDebuffStatusIcons = createStruct(
  "DebuffStatusIcons",
  [
    createStructParam(
      "mhp",
      {
        struct: structDebuffStatusIcon,
        text: {
          ja: "最大HP弱体アイコン",
          en: "Debuff max hp icons",
        },
        default: {
          small: 48,
          large: 56,
        },
      }
    ),
    createStructParam(
      "mmp",
      {
        struct: structDebuffStatusIcon,
        text: {
          ja: "最大MP弱体アイコン",
          en: "Debuff max mp icons",
        },
        default: {
          small: 49,
          large: 57,
        },
      }
    ),
    createStructParam(
      "atk",
      {
        struct: structDebuffStatusIcon,
        text: {
          ja: "攻撃力弱体アイコン",
          en: "Debuff attack icons",
        },
        default: {
          small: 50,
          large: 58,
        },
      }
    ),
    createStructParam(
      "def",
      {
        struct: structDebuffStatusIcon,
        text: {
          ja: "防御力弱体アイコン",
          en: "Debuff defense icons",
        },
        default: {
          small: 51,
          large: 59,
        },
      }
    ),
    createStructParam(
      "mat",
      {
        struct: structDebuffStatusIcon,
        text: {
          ja: "魔法力弱体アイコン",
          en: "Debuff magical attack icons",
        },
        default: {
          small: 52,
          large: 60,
        },
      }
    ),
    createStructParam(
      "mdf",
      {
        struct: structDebuffStatusIcon,
        text: {
          ja: "魔法防御弱体アイコン",
          en: "Debuff magical defense icons",
        },
        default: {
          small: 53,
          large: 61,
        },
      }
    ),
    createStructParam(
      "agi",
      {
        struct: structDebuffStatusIcon,
        text: {
          ja: "敏捷性弱体アイコン",
          en: "Debuff agility icons",
        },
        default: {
          small: 54,
          large: 62,
        },
      }
    ),
    createStructParam(
      "luk",
      {
        struct: structDebuffStatusIcon,
        text: {
          ja: "運弱体アイコン",
          en: "Debuff luck icons",
        },
        default: {
          small: 55,
          large: 63,
        },
      }
    ),
  ]
);

const parameters = [
  createIconArrayParam(
    "elementIcons",
    {
      text: {
        ja: "属性アイコン",
        en: "Element Icons",
      },
      description: {
        ja: "属性アイコンを設定します（順序はデータベースのタイプ設定に対応します）",
        en: "Element Icons.(The order is corresponding to elements settings in database.)",
      },
      default: [0, 76, 64, 65, 66, 67, 68, 69, 70, 71],
    }
  ),
  createStructParam(
    "debuffStatusIcons",
    {
      struct: structDebuffStatusIcons,
      text: {
        ja: "ステータス弱体アイコン",
        en: "Debuff Status Icons",
      },
      default: {
        mhp: {
          small: 48,
          large: 56,
        },
        mmp: {
          small: 49,
          large: 57,
        },
        atk: {
          small: 50,
          large: 58,
        },
        def: {
          small: 51,
          large: 59,
        },
        mat: {
          small: 52,
          large: 60,
        },
        mdf: {
          small: 53,
          large: 61,
        },
        agi: {
          small: 54,
          large: 62,
        },
        luk: {
          small: 55,
          large: 63,
        },
      },
    }
  ),
  createIconArrayParam(
    "weaponTypeIcons",
    {
      text: {
        ja: "武器タイプアイコン",
        en: "Weapon type Icons",
      },
      description: {
        ja: "武器タイプアイコンを設定します（順序はデータベースのタイプ設定に対応します）",
        en: "Weapon type Icons.(The order is corresponding to elements settings in database.)",
      },
      default: [0, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107],
    }
  ),
  createIconArrayParam(
    "armorTypeIcons",
    {
      text: {
        ja: "防具タイプアイコン",
        en: "Armor type Icons",
      },
      description: {
        ja: "防具タイプアイコンを設定します（順序はデータベースのタイプ設定に対応します）",
        en: "Equip type Icons.(The order is corresponding to elements settings in database.)",
      },
      default: [0, 135, 139, 136, 129, 128],
    }
  ),
];

export const config = new ConfigDefinitionBuilder(
  "SystemTypeIcon",
  2023,
  {
    ja: "システムのタイプや弱体にアイコンを設定する",
    en: "Set system type and debuff icons.",
  }
)
  .withHistories(histories)
  .withLocate('en')
  .withParameters(parameters)
  .withStructure(structDebuffStatusIcons)
  .withStructure(structDebuffStatusIcon)
  .withHelp({
    ja: dedent`システムのタイプや弱体にアイコンを設定します。
    本プラグインは、他プラグインでタイプや弱体に関するアイコンを扱う際に
    その補助とするための設定プラグインです。
    単体では機能しません。`,
    en: `Set icons for system types and debuffs.`,
  })
  .build();
