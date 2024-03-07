import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import { createBooleanParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2024/03/07",
    version: "1.1.0",
    description: '売値0のアイテムの破棄可否設定を追加',
  },
  {
    description: '使用不可のアイテムも捨てられるように変更',
  },
  {
    date: "2024/01/21",
    version: "1.0.0",
    description: "公開",
  }
];

const parameters = [
  createBooleanParam("canDiscardZeroPrice", {
    text: "売値0破棄可否",
    description: "ONの場合、売値0のアイテムを捨てられるようになります。",
    default: false,
  })
];

export const config = new ConfigDefinitionBuilder(
  "DiscardItemCommand",
  2024,
  "アイテムシーン アイテムを捨てるコマンド"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withParameters(parameters)
  .withBaseDependency({
    name: "DarkPlasma_IndividualItemCommand",
    version: "1.1.0",
  })
  .withOrderAfterDependency({
    name: "DarkPlasma_IndividualItemCommand",
  })
  .withHelp(dedent`アイテムシーンでアイテムにカーソルを合わせて決定を押した際、
  捨てるコマンドを表示します。`)
  .build();
