import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import { } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/11/27",
    version: "1.0.1",
    description: "カーソル自動スクロールにオフセット設定を適用",
  },
  {
    description: "スクロール可能な高さに縦方向オフセットを含める",
  },
  {
    date: "2026/08/22",
    version: "1.0.0",
    description: "最初のバージョン",
  }
];

export const config = new ConfigDefinitionBuilder(
  "WindowItemRectOptions",
  2026,
  "選択肢ウィンドウの矩形領域を動的にカスタマイズしやすくする"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withHelp(dedent`以下のインターフェースで選択肢ウィンドウの矩形領域をカスタマイズできます。
    
    Window_Selectable.prototype.setItemRectOptions(options: WindowItemRectOptions): void;
    
    type WindowItemRectOptions = {
      itemWidth?: number;   // 矩形の幅
      itemHeight?: number;  // 矩形の高さ
      colSpacing?: number;  // 横方向の間隔
      rowSpacing?: number;  // 縦方向の間隔
      offsetX?: number;     // 横方向オフセット
      offsetY?: number;     // 縦方向オフセット
    };`)
  .build();
