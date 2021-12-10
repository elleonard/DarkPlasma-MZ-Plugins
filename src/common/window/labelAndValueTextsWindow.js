import { LabelAndValueText } from '../object/labelAndValueText';

export class Window_LabelAndValueTexts extends Window_Base {
  initialize(rect) {
    super.initialize(rect);
    this.refresh();
  }

  drawPercent() {
    const width = this.contentsWidth();
    const valueWidth = this.valueWidth();
    this.labelAndValueTexts().forEach((labelAndValueText, index) => {
      this.drawText(labelAndValueText.label, 0, this.lineHeight() * index, width - valueWidth);
      this.drawText(labelAndValueText.valueText, 0, this.lineHeight() * index, width, 'right');
    });
  }

  valueWidth() {
    return this.textWidth('100.0％');
  }

  /**
   * @return {LabelAndValueText[]}
   */
  labelAndValueTexts() {
    return [];
  }

  refresh() {
    this.contents.clear();
    this.drawPercent();
  }
}
