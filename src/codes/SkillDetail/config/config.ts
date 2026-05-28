import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema, PluginParameterSchema } from '../../../../modules/config/configSchema.js';
import { createSelectParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/05/29",
    version: "2.1.0",
    description: "詳細ウィンドウへのアイテムセットインターフェースを追加",
  },
  {
    description: "configをTypeScript移行",
  },
  {
    date: "2024/04/20",
    version: "2.0.1",
    description: '共通化した実装を基底プラグインに分離',
  },
  {
    date: "2024/04/17",
    version: "2.0.0",
    description: '実装をItemDetailに合わせる',
  },
  {
    description: 'Window_SkillDetailMixInを削除',
  },
  {
    date: "2023/12/09",
    version: "1.1.0",
    description: '戦闘中に表示する機能を追加',
  },
  {
    date: "2023/09/04",
    version: "1.0.1",
    description: 'typescript移行',
  },
  {
    date: "2022/01/07",
    version: "1.0.0",
    description: '公開',
  },
];

const parameters: PluginParameterSchema[] = [
  createSelectParam("openDetailKey", {
    text: "詳細説明ボタン",
    description: "詳細説明を開くためのボタン",
    options: [
      {
        name: "pageup",
      },
      {
        name: "pagedown",
      },
      {
        name: "shift",
      },
      {
        name: "control",
      },
      {
        name: "tab",
      },
    ],
    default: "shift",
  }),
];

export const config = new ConfigDefinitionBuilder(
  "SkillDetail",
  2026,
  "スキルに詳細説明文を追加する"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withParameters(parameters)
  .withBaseDependency({
    name: "DarkPlasma_CustomKeyHandler",
    version: "2.0.0",
    order: 'after',
  })
  .withBaseDependency({
    name: "DarkPlasma_DisplayDatabaseDetailWindow",
    version: "1.0.1",
    order: 'after',
  })
  .withHelp(dedent`スキルウィンドウのスキルにカーソルを合わせて特定のボタンを押すと
      スキル詳細説明画面を開きます。

      スキルのメモ欄に下記のような記述で詳細説明を記述できます。
      <detail:詳細説明文。
      ～～～～。>`)
  .build();
