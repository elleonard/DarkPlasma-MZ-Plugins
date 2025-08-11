import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema, PluginParameterSchema, PluginStruct } from '../../../../modules/config/configSchema.js';
import { createDatabaseArrayParam, createStringParam, createStruct, createStructArrayParam, createStructParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2025/08/11",
    version: "1.0.0",
    description: "StateGroupから機能分離",
  },
  {
    description: "グループに対する優位を廃止",
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
    description: "所属するステートを優先度順に設定します。下にあるほど優先度が高くなります。",
  }),
]);

const parameters: PluginParameterSchema[] = [
  createStructArrayParam("groups", {
    struct: structGroup,
    text: "グループ",
  }),
];

export const config = new ConfigDefinitionBuilder(
  "PriorityStateGroup",
  2025,
  "優先度付きステートグループ"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withStructure(structGroup)
  .withParameters(parameters)
  .withHelp(dedent`
    ステートを優先度付きのグループに分類します。
    同じ優先度付きグループに属するステートは重ねがけできません。

    グループの定義
    プラグインパラメータで定義できます。

    ステートの優先度
    プラグインパラメータによる設定の順番がそのまま優先度になります。
    （下にあるほど優先度が高い）
    あるステートにかかる際、
    同じグループのより優先度の低いステートを上書きします。

    メモ欄による設定

    グループへの所属
    <stateGroup: x>
    <statePriority: y>
    対象ステートをあるグループに所属させることができます。
    （xはグループ名）
    複数のグループに所属させる場合は、
    プラグインパラメータによる設定を利用してください。

    グループ内での優先度をyに設定します。
    数値が大きいほど優先度が高くなります。
    stateGroupメモタグを指定しない場合、本メモタグの効果はありません。
    stateGroupメモタグを指定し、本メモタグを指定しなかった場合、
    優先度付きグループには所属しません。
    複数のステートが同一の優先度を持つ場合、
    後に付加されるステートで上書きされます。`)
  .build();
