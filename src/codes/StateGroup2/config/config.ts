import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema, PluginParameterSchema, PluginStruct } from '../../../../modules/config/configSchema.js';
import { createDatabaseArrayParam, createStringParam, createStruct, createStructArrayParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2025/08/11",
    version: "2.0.0",
    description: "優先度をつける機能をPriorityStateGroupに分離",
  },
  {
    date: "2025/05/18",
    version: "1.2.1",
    description: "プラグインパラメータでグループ設定を行うと起動時にエラーで停止する不具合を修正",
  },
  {
    date: "2022/10/15",
    version: "1.2.0",
    description: "DarkPlasma_StateBuffOnBattleStartにおけるグループに対する優位の挙動を定義",
  },
  {
    date: "2022/10/10",
    version: "1.1.1",
    description: "typescript移行",
  },
  {
    date: "2022/06/21",
    version: "1.1.0",
    description: "ステートを複数グループに所属させる",
  },
  {
    description: "グループに対する優位設定",
  },
  {
    date: "2021/07/05",
    version: "1.0.3",
    description: "MZ 1.3.2に対応",
  },
  {
    date: "2021/06/22",
    version: "1.0.2",
    description: "サブフォルダからの読み込みに対応",
  },
  {
    date: "2020/09/08",
    version: "1.0.1",
    description: "rollup構成へ移行",
  },
  {
    date: "2020/08/27",
    version: "1.0.0",
    description: "MZ版公開",
  },
];

const structGroup: PluginStruct = createStruct("StateGroup", [
  createStringParam("name", {
    text: "グループ名",
    description: "グループの名前を指定します。半角スペース及びカンマは無視されます。",
  }),
  createDatabaseArrayParam("states", {
    type: 'state',
    text: "所属ステート",
    description: "所属するステート設定します。",
  }),
]);

const parameters: PluginParameterSchema[] = [
  createStructArrayParam("groups", {
    struct: structGroup,
    text: "グループ",
  }),
];

export const config = new ConfigDefinitionBuilder(
  "StateGroup2",
  2025,
  "ステートをグルーピングする"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withStructure(structGroup)
  .withParameters(parameters)
  .withHelp(dedent`
    ステートをグルーピングします。

    2.0.0以降、優先度をつけて同じグループに属するステートを
    重複しないようにする機能は廃止されました。
    DarkPlasma_PriorityStateGroupをご利用ください。

    ステートのメモ欄に以下のように記述すると
    ステートをグループxに所属させることができます。
    <stateGroup: x>
    複数のグループに所属させる場合は、
    プラグインパラメータによる設定を利用してください。

    本プラグインは単体では意味を成しません。
    グループに関する機能を持つ他のプラグインと組み合わせてご利用ください。
  `)
  .build();
