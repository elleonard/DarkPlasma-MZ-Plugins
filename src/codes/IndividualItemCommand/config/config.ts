import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import {} from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories = [
  {
    date: "2024/01/21",
    version: "1.1.0",
    description: "個別コマンドウィンドウのインターフェース公開",
  },
  {
    date: "2024/01/21",
    version: "1.0.0",
    description: "公開",
  }
];

export const config = new ConfigDefinitionBuilder(
  "IndividualItemCommand",
  2024,
  "アイテムシーン アイテムに個別でコマンドを表示する"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withHelp(dedent`アイテムシーンでアイテムにカーソルを合わせて決定を押した際、
  個別でコマンドを表示します。`)
  .build();
