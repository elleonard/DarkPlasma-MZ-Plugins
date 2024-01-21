import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import {} from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories = [
  {
    date: "2024/01/21",
    version: "1.0.0",
    description: "公開",
  }
];

export const config = new ConfigDefinitionBuilder(
  "DiscardItemCommand",
  2024,
  "アイテムシーン アイテムを捨てるコマンド"
)
  .withHistories(histories)
  .withLicense("MIT")
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
