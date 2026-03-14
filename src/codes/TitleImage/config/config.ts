import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginCommandSchema, PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import { createCommand, createFileParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/03/15",
    version: "1.0.0",
    description: "最初のバージョン",
  }
];

const commandChangeTitleImage: PluginCommandSchema = createCommand("changeTitleImage", {
  text: "タイトル画像を変更する",
  args: [
    createFileParam("title1", {
      text: "タイトル画像1",
      dir: "img/titles1/",
    }),
    createFileParam("title2", {
      text: "タイトル画像2",
      dir: "img/titles2/",
    }),
  ],
});

const commandResetTitleImage: PluginCommandSchema = createCommand("resetTitleImage", {
  text: "タイトル画像を元に戻す",
  description: "タイトル画像をデータベースで指定したものに戻します。",
});

export const config = new ConfigDefinitionBuilder(
  "TitleImage",
  2026,
  "タイトル画像を変更する"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withCommands([
    commandChangeTitleImage,
    commandResetTitleImage,
  ])
  .withBaseDependency({
    name: "DarkPlasma_SharedSaveInfo",
    version: "1.0.0",
    order: 'after',
  })
  .withHelp(dedent`タイトル画面に用いる画像を変更します。`)
  .build();
