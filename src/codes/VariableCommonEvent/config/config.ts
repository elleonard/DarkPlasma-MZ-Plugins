import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import { createCommand, createDatabaseParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2024/10/27",
    version: "1.0.0",
    description: "公開",
  }
];

const commandVariableCommonEvent = createCommand("variableCommonEvent", {
  text: "可変コモンイベント",
  description: "変数を指定し、その値をIDとして持つコモンイベントを呼び出します。",
  args: [
    createDatabaseParam("variableId", {
      type: 'variable',
      text: "変数",
      description: "指定した変数の値をIDとして持つコモンイベントを呼び出します。",
      default: 0,
    }),
  ],
});

export const config = new ConfigDefinitionBuilder(
  "VariableCommonEvent",
  2024,
  "変数によって指定したIDのコモンイベントを呼び出す"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withCommand(commandVariableCommonEvent)
  .withHelp(dedent`変数を指定し、その値をIDとして持つコモンイベントを
    呼び出すプラグインコマンドを提供します。`)
  .build();
