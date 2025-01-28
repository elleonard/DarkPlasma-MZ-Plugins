import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import { createStruct, createStructParam, createStringParam, createStructArrayParam, createMultilineStringArrayParam, createDatabaseParam, createNumberParam, createSelectParam, createBooleanParam, createMultilineStringParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2025/01/28",
    version: "1.3.1",
    description: "SG表示スイッチNタグが正常に動作しない不具合を修正"
  },
  {
    version: "1.3.0",
    description: "SG表示スイッチNタグ及び一部のSGピクチャ関連タグに対応",
  },
  {
    date: "2024/05/23",
    version: "1.2.4",
    description: "不要なウィンドウレイヤーを削除",
  },
  {
    date: "2024/01/15",
    version: "1.2.3",
    description: "ビルド方式を変更 (configをTypeScript化)",
  },
  {
    date: "2022/11/13",
    version: "1.2.2",
    description: "typescript移行",
  },
  {
    date: "2022/07/02",
    version: "1.2.1",
    description: "ページ番号表示設定が正常に扱えない不具合の修正",
  },
  {
    date: "2022/06/21",
    version: "1.2.0",
    description: "ショートカットキーなし設定を追加",
  },
  {
    date: "2022/05/16",
    version: "1.1.0",
    description: "SceneGlossaryの説明文のみ引用する機能を追加",
  },
  {
    description: "フォントサイズ設定を追加",
  },
  {
    description: "左右キーでページめくり機能追加",
  },
  {
    description: "ページめくり可能な場合、左右矢印を表示",
  },
  {
    date: "2022/04/25",
    version: "1.0.1",
    description: "ウィンドウレイヤー位置調整",
  },
  {
    date: "2022/04/24",
    version: "1.0.0",
    description: "公開",
  },
];

const structCondition = createStruct(
  "Condition",
  [
    createDatabaseParam(
      "switchId",
      {
        type: "switch",
        text: "スイッチ",
        description: "指定した場合、このスイッチがONの場合のみ手引書に表示します。",
      }
    ),
    createDatabaseParam(
      "variableId",
      {
        type: "variable",
        text: "変数",
        description: "指定した場合、この変数が閾値より大の場合のみ手引書に表示します。",
      }
    ),
    createNumberParam(
      "threshold",
      {
        text: "閾値",
      }
    ),
  ]
);

const structGuide = createStruct(
  "Guide",
  [
    createStringParam(
      "title",
      {
        text: "名前",
        description: "手引書の目次に表示される名前を設定します。",
      }
    ),
    createMultilineStringArrayParam(
      "texts",
      {
        text: "内容",
        description: "手引書の具体的な内容を設定します。",
      }
    ),
    createDatabaseParam(
      "glossaryItem",
      {
        type: "item",
        text: "用語集参照アイテム",
        description: "SceneGlossaryで設定した説明文を参照します。指定した場合、名前と内容設定を無視します。",
      }
    ),
    createStructParam(
      "condition",
      {
        struct: structCondition,
        text: "表示条件",
        description: "この条件を満たした場合にのみ手引書に表示します。",
        default: {
          switchId: 0,
          variableId: 0,
          threshold: 0,
        }
      }
    ),
  ]
);

const parameters = [
  createStructArrayParam(
    "guides",
    {
      struct: structGuide,
      text: "手引書",
    }
  ),
  createNumberParam(
    "listWidth",
    {
      text: "目次横幅",
      description: "手引書の目次ウィンドウの横幅を設定します。",
      default: 240,
    }
  ),
  createNumberParam(
    "fontSize",
    {
      text: "フォントサイズ",
      description: "手引書のフォントサイズを設定します。",
      default: 22,
    }
  ),
  createSelectParam(
    "showPageNumber",
    {
      text: "ページ番号表示",
      description: "ページ番号の表示戦略を設定します。",
      options: [
        {
          name: "default(2ページ以上の場合表示)",
          value: 0,
        },
        {
          name: "always(常に表示)",
          value: 1,
        },
        {
          name: "no(表示なし)",
          value: 2,
        },
      ],
      default: 0,
    }
  ),
  createSelectParam(
    "key",
    {
      text: "手引書を開くキー",
      options: [
        {
          name: '',
        },
        {
          name: 'pageup',
        },
        {
          name: 'pagedown',
        },
        {
          name: 'shift',
        },
        {
          name: 'control',
        },
        {
          name: 'tab',
        },
      ],
      default: "",
    }
  ),
  createBooleanParam(
    "addPartyCommand",
    {
      text: "パーティコマンドに追加する",
      default: true,
    }
  ),
  createStringParam(
    "partyCommandName",
    {
      text: "パーティコマンド名",
      default: "手引書",
    }
  ),
];

export const config = new ConfigDefinitionBuilder(
  "BattleGuide",
  2022,
  "戦闘の手引書表示"
)
  .withHistories(histories)
  .withParameters(parameters)
  .withStructure(structGuide)
  .withStructure(structCondition)
  .withBaseDependency({
    name: "DarkPlasma_CustomKeyHandler",
    version: "1.1.0",
  })
  .withBaseDependency({
    name: "DarkPlasma_ManualText",
    version: "1.3.0",
  })
  .withOrderAfterDependency({
    name: "DarkPlasma_CustomKeyHandler",
  })
  .withOrderAfterDependency({
    name: "DarkPlasma_ManualText",
  })
  .withHelp(dedent`戦闘中に手引書を表示することができます。

  SceneGlossaryの一部タグを利用可能です。
  - SG説明, SGDescription
  - SG表示スイッチ, SGVisibleSwitch
  - SGピクチャ, SGPicture
  - SGピクチャX, SGPictureX
  - SGピクチャY, SGPictureY
  - SGピクチャ優先度, SGPicturePriority
  - SGピクチャ揃え, SGPictureAlign`)
  .build();
