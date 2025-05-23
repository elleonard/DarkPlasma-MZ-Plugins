import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema, PluginParameterSchema } from '../../../../modules/config/configSchema.js';
import { createNumberParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2025/04/02",
    version: "1.1.0",
    description: "バッファサイズ設定を追加",
  },
  {
    version: "1.0.0",
    description: "公開",
  }
];

const parameters: PluginParameterSchema[] = [
  createNumberParam("bufferSize", {
    text: "コマンドバッファサイズ",
    description: "記憶するコマンドバッファのサイズを指定します。",
    default: 10,
  }),
];

export const config = new ConfigDefinitionBuilder(
  "InputSequentialCommand",
  2025,
  "一連のコマンド入力"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withParameters(parameters)
  .withHelp(dedent`一連のコマンド入力をチェックできます。
    
    Input.clearBuffer(): void
    コマンド入力バッファを初期化します。
    
    Input.isSequentialInputted(command: string[]): boolean
    コマンド列が最後に入力されたかどうかを判定します。`)
  .build();
