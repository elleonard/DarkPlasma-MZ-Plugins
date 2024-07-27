import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema, PluginParameterSchema } from '../../../../modules/config/configSchema.js';
import { createNumberParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2024/07/27",
    version: "1.0.0",
    description: "公開",
  }
];

const parameters: PluginParameterSchema[] = [
  createNumberParam("maxSavefiles", {
    text: "セーブファイル数",
    description: "セーブファイルを作れる最大数を設定します。",
    default: 20,
  }),
];

export const config = new ConfigDefinitionBuilder(
  "MaxSavefiles",
  2024,
  "セーブファイルの最大数を変更する"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withParameters(parameters)
  .withHelp(dedent`セーブファイルを作れる最大数を変更します。`)
  .build();
