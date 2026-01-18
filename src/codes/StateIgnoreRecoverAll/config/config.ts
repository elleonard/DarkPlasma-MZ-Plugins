import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema, PluginParameterSchema } from '../../../../modules/config/configSchema.js';
import { createDatabaseArrayParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/01/18",
    version: "1.0.0",
    description: "最初のバージョン",
  }
];

const parameters: PluginParameterSchema[] = [
  createDatabaseArrayParam("states", {
    type: 'state',
    text: "ステート",
    description: "指定したステートは全回復で解除されません。",
  }),
];

export const config = new ConfigDefinitionBuilder(
  "StateIgnoreRecoverAll",
  2026,
  "全回復で解除されないステート"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withParameters(parameters)
  .withHelp(dedent`イベントコマンド「全回復」で解除されないステートを実現します。`)
  .build();
