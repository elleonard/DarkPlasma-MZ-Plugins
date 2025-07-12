import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginCommandSchema, PluginHistorySchema, PluginParameterSchema } from '../../../../modules/config/configSchema.js';
import { createBooleanParam, createCommand, createLocationArrayParam, createLocationParam, createMultilineStringParam, createNumberParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2025/07/12",
    version: "1.1.0",
    description: "ヘルプテキスト設定を追加",
  },
  {
    description: "背景をぼかす",
  },
  {
    version: "1.0.0",
    description: "公開",
  }
];

const commandOpen: PluginCommandSchema = createCommand("open", {
  text: "パーティ分割シーンを開く",
  args: [
    createNumberParam("count", {
      text: "パーティ数",
      description: "分割後のパーティ数",
      min: 2,
      max: 3,
      default: 2,
    }),
    createLocationArrayParam("locations", {
      text: "初期位置一覧",
      description: "パーティごとの初期位置一覧を指定します。",
    }),
  ],
});

const parameters: PluginParameterSchema[] = [
  createBooleanParam("showHelpWindow", {
    text: "ヘルプウィンドウを表示",
    default: true,
  }),
  createMultilineStringParam("helpText", {
    text: "ヘルプ",
    description: "ヘルプウィンドウに表示するテキストを設定します。",
  }),
];

export const config = new ConfigDefinitionBuilder(
  "DevidePartyScene",
  2025,
  "パーティ分割シーン"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withParameters(parameters)
  .withCommand(commandOpen)
  .withBaseDependency({
    name: "DarkPlasma_ConcurrentParty",
    version: "1.1.0",
  })
  .withBaseDependency({
    name: "DarkPlasma_SelectActorCharacterWindow",
    version: "1.0.0",
    order: 'after',
  })
  .withHelp(dedent`パーティを分割するシーンを提供します。`)
  .build();
