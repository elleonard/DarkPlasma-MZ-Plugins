import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import { createSelectParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: '2024/04/20',
    version: '1.0.2',
    description: '共通化した実装を基底プラグインに分離',
  },
  {
    date: '2024/04/17',
    version: '1.0.1',
    description: '詳細説明を開けるウィンドウのmixinを共通化'
  },
  {
    date: "2024/04/17",
    version: "1.0.0",
    description: "公開",
  },
];

const parameters = [
  createSelectParam('openDetailKey', {
    text: '詳細説明ボタン',
    description: '詳細説明を開くためのボタンを設定します。',
    options: [
      {
        name: 'pageup',
      },
      {
        name: 'pagedown',
      },
      {
        name: 'shift',
      },
      {
        name: 'control',
      },
      {
        name: 'tab',
      },
    ],
    default: 'shift',
  }),
];

export const config = new ConfigDefinitionBuilder(
  "EquipDetail",
  2024,
  "装備シーンで装備品の詳細説明を表示する"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withParameters(parameters)
  .withDependency({
    name: 'DarkPlasma_CustomKeyHandler',
    version: '1.3.0',
    base: true,
    order: "after",
  })
  .withDependency({
    name: 'DarkPlasma_DisplayDatabaseDetailWindow',
    version: '1.0.0',
    base: true,
    order: "after",
  })
  .withHelp(dedent`装備シーンの装備にカーソルを合わせて特定のボタンを押すと
  装備詳細説明ウィンドウを開きます。
  
  装備のメモ欄に下記のような記述で詳細説明を記述できます。
  <detail:詳細説明文。
  ～～～～。>`)
  .build();
