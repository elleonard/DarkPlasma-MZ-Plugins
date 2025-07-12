import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginCommandSchema, PluginHistorySchema, PluginParameterSchema, PluginStruct } from '../../../../modules/config/configSchema.js';
import { createBooleanParam, createCommand, createDatabaseArrayParam, createDatabaseParam, createLocationParam, createNumberParam, createSelectParam, createStruct, createStructArrayParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2025/07/12",
    version: "1.1.0",
    description: "分割したパーティをセーブできない不具合を修正",
  },
  {
    description: "切り替えプラグインコマンドに自動フェード設定を追加",
  },
  {
    date: "2025/06/07",
    version: "1.0.0",
    description: "最初のバージョン",
  }
];

const structParty: PluginStruct = createStruct("Party", [
  createDatabaseArrayParam("actorIds", {
    type: "actor",
    text: "アクター一覧",
    description: "このパーティに含むアクターを指定します。有効でないアクターは無視します。",
  }),
  createLocationParam("location", {
    text: "初期位置",
    description: "分割したパーティの初期位置を設定します。",
  }),
  createSelectParam("direction", {
    text: "初期向き",
    description: "分割したパーティの初期向きを設定します。",
    options: [
      {
        name: "上",
        value: 8,
      },
      {
        name: "下",
        value: 2,
      },
      {
        name: "左",
        value: 4
      },
      {
        name: "右",
        value: 6,
      },
    ],
    default: 2,
  }),
]);

const commandDevideParty: PluginCommandSchema = createCommand("devideParty", {
  text: "パーティを分割する",
  description: "指定した構成でパーティを分割します。すでに分割されている場合は何もしません。",
  args: [
    createStructArrayParam("parties", {
      struct: structParty,
      text: "パーティ一覧",
      description: "パーティ一覧を指定します。有効でないパーティは無視します。",
    }),
  ],
});

const commandArgsChangeParty: PluginParameterSchema[] = [
  createBooleanParam("autoFadeOut", {
    text: "自動フェードアウト",
    description: "切り替え前に自動でフェードアウトします。",
    default: true,
  }),
  createBooleanParam("autoFadeIn", {
    text: "自動フェードイン",
    description: "切り替え後に自動フェードインします。",
    default: true,
  }),
];

const commandNextParty: PluginCommandSchema = createCommand("nextParty", {
  text: "次のパーティに切り替える",
  description: "次のパーティへ操作を切り替えます。最後のパーティからは最初のパーティに切り替えます。",
  args: commandArgsChangeParty,
});

const commandPreviousParty: PluginCommandSchema = createCommand("previousParty", {
  text: "前のパーティに切り替える",
  description: "前のパーティへ操作を切り替えます。最初のパーティからは最後のパーティに切り替えます。",
  args: commandArgsChangeParty,
});

const commandJoinAllMember: PluginCommandSchema = createCommand("joinAllMember", {
  text: "全員合流する",
  description: "分割状態をリセットし、全メンバーで合流します。",
});

const commandLeaderId: PluginCommandSchema = createCommand("leaderId", {
  text: "パーティリーダーを取得する",
  description: "指定したパーティのリーダーであるアクターのIDを取得します。",
  args: [
    createDatabaseParam("variableId", {
      type: "variable",
      text: "変数",
      description: "アクターIDを代入する変数を選択します。",
    }),
    createNumberParam("partyIndex", {
      text: "パーティインデックス",
      description: "パーティのインデックスを指定します。",
    }),
  ],
});

const commandPartyIndex: PluginCommandSchema = createCommand("partyIndex", {
  text: "パーティインデックスを取得する",
  description: "指定した変数に現在のパーティのインデックスを取得します。",
  args: [
    createDatabaseParam("variableId", {
      type: "variable",
      text: "変数",
    }),
  ],
});

const commandPartyPosition: PluginCommandSchema = createCommand("partyPosition", {
  text: "パーティの位置を取得する",
  description: "指定した変数に指定したパーティの位置を取得します。",
  args: [
    createDatabaseParam("mapIdVariableId", {
      type: "variable",
      text: "マップID変数",
      description: "マップIDを代入する変数を選択します。",
    }),
    createDatabaseParam("xVariableId", {
      type: "variable",
      text: "X座標変数",
      description: "X座標を代入する変数を選択します。",
    }),
    createDatabaseParam("yVariableId", {
      type: "variable",
      text: "Y座標変数",
      description: "Y座標を代入する変数を選択します。",
    }),
    createDatabaseParam("directionVariableId", {
      type: "variable",
      text: "向き変数",
      description: "向きを代入する変数を選択します。",
    }),
    createNumberParam("partyIndex", {
      text: "パーティインデックス",
      description: "パーティのインデックスを指定します。",
    }),
  ],
});

const parameters: PluginParameterSchema[] = [
  createSelectParam("nextPartyButton", {
    text: "次へ切り替えボタン",
    options: [
      {
        name: "pageup",
      },
      {
        name: "pagedown",
      },
      {
        name: "shift",
      },
      {
        name: "control",
      },
      {
        name: "tab",
      },
    ],
    default: "pagedown",
  }),
  createSelectParam("previousPartyButton", {
    text: "前へ切り替えボタン",
    options: [
      {
        name: "pageup",
      },
      {
        name: "pagedown",
      },
      {
        name: "shift",
      },
      {
        name: "control",
      },
      {
        name: "tab",
      },
    ],
    default: "pageup",
  }),
  createDatabaseParam("disableChangeSwitch", {
    type: "switch",
    text: "切り替え禁止スイッチ",
  }),
  createDatabaseParam("commonEvent", {
    type: "common_event",
    text: "切り替え時コモンイベント",
    description: "パーティ切り替え時に予約するコモンイベントを指定します。",
  }),
];

export const config = new ConfigDefinitionBuilder(
  "ConcurrentParty",
  2025,
  "並行パーティシステム"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withStructure(structParty)
  .withParameters(parameters)
  .withCommands([
    commandDevideParty,
    commandNextParty,
    commandPreviousParty,
    commandJoinAllMember,
    commandLeaderId,
    commandPartyIndex,
    commandPartyPosition,
  ])
  .withHelp(dedent`パーティを分割し、操作を切り替えて並行で進むシステムを提供します。
    
    プラグインコマンドでパーティを分割することができます。
    分割パーティモード中、更にパーティを分割することはできません。
    
    パーティ分割で指定できる有効なアクターとは、以下を満たすアクターです。
    - 他の分割パーティに含まれていない
    - 分割前のパーティに含まれている
    
    有効なパーティとは、有効なアクターが1人以上含まれるパーティを指します。`)
  .build();
