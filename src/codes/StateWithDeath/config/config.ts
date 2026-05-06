import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema, PluginParameterSchema } from '../../../../modules/config/configSchema.js';
import { createDatabaseArrayParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/05/06",
    version: "2.0.0",
    description: "ステート情報の退避を別プラグインに分離",
  },
  {
    description: "戦闘不能を挟むとステート解除までの歩数情報が消えてしまう不具合を修正",
  },
  {
    date: "2023/11/18",
    version: "1.1.0",
    description: 'TypeScript移行',
  },
  {
    description: '戦闘不能後も継続するステート一覧を取得するインターフェース追加',
  },
  {
    date: "2022/05/29",
    version: "1.0.1",
    description: '戦闘時にエラーになる不具合を修正',
  },
  {
    version: "1.0.0",
    description: '公開',
  },
];

const parameters: PluginParameterSchema[] = [
  createDatabaseArrayParam("statesWithDeath", {
    type: 'state',
    text: "消えないステート",
  }),
];

export const config = new ConfigDefinitionBuilder(
  "StateWithDeath",
  2026,
  "戦闘不能になっても消えないステート"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withParameters(parameters)
  .withBaseDependency({
    name: "DarkPlasma_EvacuateStateAndMeta",
    version: "1.0.0",
    order: 'after',
  })
  .withHelp(dedent`指定したステートは戦闘不能になっても解除されません。`)
  .build();
