import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import { createCommand, createNumberParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2024/04/06",
    version: "1.0.1",
    description: "マスクをかけたピクチャIDに対してピクチャの表示を行うとマスクが解除される不具合を修正",
  },
  {
    date: "2024/04/04",
    version: "1.0.0",
    description: "公開",
  }
];

const commandMaskPicture = createCommand("maskPicture", {
  text: "ピクチャをマスクする",
  args: [
    createNumberParam("basePictureId", {
      text: "ベースピクチャID",
    }),
    createNumberParam("maskPictureId", {
      text: "マスクピクチャID",
    }),
  ],
});

const commandUnmaskPicture = createCommand("unmaskPicture", {
  text: "ピクチャにかけたマスクを解除する",
  args: [
    createNumberParam("basePictureId", {
      text: "ベースピクチャID",
    }),
  ],
});

export const config = new ConfigDefinitionBuilder(
  "MaskPicture",
  2024,
  "ピクチャを別のピクチャでマスクする"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withCommand(commandMaskPicture)
  .withCommand(commandUnmaskPicture)
  .withHelp(dedent`ピクチャでピクチャをマスクします。`)
  .build();
