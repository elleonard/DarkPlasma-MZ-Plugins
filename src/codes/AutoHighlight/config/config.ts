import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import { createStruct, createStringParam, createColorParam, createStringArrayParam, createDatabaseArrayParam, createStructArrayParam } from '../../../../modules/config/createParameter.js';

const histories: PluginHistorySchema[] = [
  {
    date: "2024/01/15",
    version: "2.0.1",
    description: "ビルド方式を変更 (configをTypeScript化)",
  },
  {
    date: "2023/06/02",
    version: "2.0.0",
    description: "色設定をMZ1.6.0形式に変更",
  },
  {
    description: "ベースプラグインを追加",
  },
  {
    description: "TypeScript移行",
  },
  {
    date: "2022/06/08",
    version: "1.0.1",
    description: "対象ウィンドウのクラス名がグローバルに展開されていなくても有効にする",
  },
  {
    date: "2022/01/02",
    version: "1.0.0",
    description: "公開",
  },
];

const structHighlightGroup = createStruct(
  "HighlightGroup",
  [
    createStringParam(
      "title",
      {
        text: "名前",
        description: "色と語句設定の管理用の名前を指定します。わかりやすい名前をつけてください。",
      }
    ),
    createColorParam(
      "color",
      {
        text: "色",
        description: "色を指定します。#から始まるカラーコードも指定可能です。",
      }
    ),
    createStringArrayParam(
      "texts",
      {
        text: "語句",
        description: "ハイライトしたい語句を指定します。",
      }
    ),
    createDatabaseArrayParam(
      "skills",
      {
        type: "skill",
        text: "スキル",
        description: "名前をハイライトしたいスキルを指定します。",
      }
    ),
    createDatabaseArrayParam(
      "items",
      {
        type: "item",
        text: "アイテム",
        description: "名前をハイライトしたいアイテムを指定します。",
      }
    ),
  ]
);

const parameters = [
  createStructArrayParam(
    "highlightGroups",
    {
      struct: structHighlightGroup,
      text: "色と語句",
      description: "ハイライトする際の色と語句を設定します。",
    }
  ),
  createStringArrayParam(
    "targetWindows",
    {
      text: "対象ウィンドウ",
      description: "自動ハイライトの対象となるウィンドウクラスを指定します。",
      default: ["Window_Message"],
    }
  ),
];

export const config = new ConfigDefinitionBuilder(
  "AutoHighlight",
  2022,
  "指定した語句に自動で色をつける"
)
  .withHistories(histories)
  .withParameters(parameters)
  .withStructure(structHighlightGroup)
  .withBaseDependency({
    name: "DarkPlasma_SetColorByCode",
    version: "1.0.0",
  })
  .withHelp(`指定した語句を指定した色でハイライトします。`)
  .build();
