// DarkPlasma_TestBase 2.4.2
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2021/07/05 2.4.2 MZ 1.3.2に対応
 * 2021/06/22 2.4.1 サブフォルダからの読み込みに対応
 * 2021/01/11 2.4.0 テストケースプラグインの手動読み込みを許可する
 * 2020/10/30 2.3.0 mustBeTrueを追加
 * 2020/10/26 2.2.0 0より大の整数値,要素を持つ配列のためのspecを作りやすくする機能追加
 * 2020/10/24 2.1.0 プラグインコマンド起因でテストする機能追加
 * 2020/10/23 2.0.0 Scene_BootのaddTestCaseを削除
 *                  テストケースウィンドウの表示が固定化される不具合を修正
 *            1.0.1 不要コードの削除
 * 2020/10/22 1.0.0 公開
 */

/*:ja
 * @plugindesc プラグインの半自動テストをサポートする
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @command openTestCase
 * @text テストケースシーンを開く
 * @desc テストケースシーンを開きます。
 *
 * @command doTest
 * @text テスト実行
 * @desc プラグインコマンド起因のテストを実行します。
 *
 * @help
 * version: 2.4.2
 * 本プラグインはプラグインの半自動テストをサポートします。
 *
 * Scene_Boot.prototype.defineTestCaseをフックしてテストケースを定義してください。
 * 以下のインターフェースで定義できます。
 * this.addTestCase(string pluginName, string version, string testCaseName, boolean isAuto);
 *
 * テストの実行結果を登録するには以下のように書きます。
 * $testTargetPlugins.doTest(string pluginName, string version, string testCaseName, TestSpec[] testSpecs);
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const PLUGIN_COMMAND_NAME = {
    OPEN_TEST_CASE: 'openTestCase',
    DO_TEST: 'doTest',
  };

  const TESTCASE_STATUS = {
    NOT_YET: 0,
    SUCCESSED: 1,
    FAILED: 2,
  };

  /**
   * PluginManager
   */
  PluginManager._testScripts = [];
  PluginManager._loadedTestScriptsCount = 0;

  PluginManager.registerCommand(pluginName, PLUGIN_COMMAND_NAME.OPEN_TEST_CASE, function () {
    SceneManager.push(Scene_TestCase);
  });

  PluginManager.registerCommand(pluginName, PLUGIN_COMMAND_NAME.DO_TEST, function () {
    this.doTest();
  });

  /**
   * 読み込まれたプラグインからテストケースプラグインを探し、それがあれば読み込む
   * @param {MZ.Plugin[]} plugins プラグインの配列
   */
  PluginManager.setupTestPlugins = function (plugins) {
    if (Utils.isNwjs()) {
      const fs = require('fs');
      const loadedPluginNames = plugins.filter((plugin) => plugin.status).map((plugin) => plugin.name);
      plugins
        .filter((plugin) => plugin.status)
        .map((plugin) => {
          return {
            name: `${plugin.name}_Test`,
          };
        })
        .filter((plugin) => !loadedPluginNames.includes(plugin.name) && fs.existsSync(this.makeUrl(plugin.name)))
        .forEach((plugin) => {
          this.setParameters(plugin.name, {});
          this.loadTestScript(plugin.name);
          this._testScripts.push(plugin.name);
        });
    }
  };

  /**
   * テストケースプラグインが全てロードされているか
   * @return {boolean}
   */
  PluginManager.testScriptsLoaded = function () {
    return this._loadedTestScriptsCount === this._testScripts.length;
  };

  PluginManager.onTestScriptLoad = function () {
    this._loadedTestScriptsCount++;
  };

  /**
   * テストケースプラグインをロードする
   * ほぼ通常のプラグイン読み込みのコピペだが、onloadを定義する都合上仕方ない
   * @param {string} filename ファイル名
   */
  PluginManager.loadTestScript = function (filename) {
    const url = this.makeUrl(filename);
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.async = false;
    script.defer = true;
    script.onload = this.onTestScriptLoad.bind(this);
    script._url = url;
    document.body.appendChild(script);
  };

  ColorManager.autoColor = function () {
    return this.textColor(24);
  };

  ColorManager.manualColor = function () {
    return this.textColor(2);
  };

  Game_Interpreter.prototype.doTest = function () {
    // DO NOTHING
  };

  /**
   * テスト対象プラグイン一覧
   */
  class TestTargetPlugins {
    constructor() {
      this._targetPlugins = [];
    }

    /**
     * @return {TestTargetPlugin[]}
     */
    get targetPlugins() {
      return this._targetPlugins;
    }

    /**
     * テスト対象プラグインを追加する
     * @param {string} name 名前
     * @param {string} version バージョン
     */
    add(name, version) {
      if (!this.find(name, version)) {
        this._targetPlugins.push(new TestTargetPlugin(name, version));
      }
    }

    /**
     * テストケースを追加する
     * @param {string} pluginName プラグイン名
     * @param {string} version バージョン
     * @param {string} testCaseName テストケース名
     * @param {boolean} isAuto 自動テストかどうか
     */
    addTestCase(pluginName, version, testCaseName, isAuto) {
      if (!this.find(pluginName, version)) {
        this.add(pluginName, version);
      }
      const plugin = this.find(pluginName, version);
      plugin.addTestCase(testCaseName, isAuto);
    }

    /**
     * 指定したテストケースの実行結果を受け取る
     * @param {string} pluginName プラグイン名
     * @param {string} version バージョン
     * @param {string} testCaseName テストケース名
     * @param {TestSpec[]} testSpecs テストスペック一覧
     */
    doTest(pluginName, version, testCaseName, testSpecs) {
      const plugin = this.find(pluginName, version);
      if (!plugin) {
        return;
      }
      for (let spec of testSpecs) {
        const testResults = spec.doTest();
        const reasons = testResults.filter((result) => !result.status).map((result) => result.message);
        plugin.doTest(
          testCaseName,
          reasons.length === 0,
          reasons.map((reason) => reason.text)
        );
        if (reasons.length > 0) {
          break;
        }
      }
    }

    /**
     * 指定した名前、バージョンのプラグインを取得する
     * @param {string} name 名前
     * @param {string} version バージョン
     * @return {TestTargetPlugin}
     */
    find(name, version) {
      return this._targetPlugins.find((plugin) => plugin.name === name && plugin.version === version);
    }

    /**
     * 指定プラグインの結果をリセットする
     * @param {string} name プラグイン名
     * @param {string} version バージョン
     */
    resetPlugin(name, version) {
      this.find(name, version).resetResults();
    }
  }

  /**
   * テスト対象プラグイン情報
   */
  class TestTargetPlugin {
    constructor(name, version) {
      this._name = name;
      this._version = version;
      this._testCases = [];
    }

    /**
     * @return {string}
     */
    get name() {
      return this._name;
    }

    /**
     * @return {string}
     */
    get version() {
      return this._version;
    }

    /**
     * @return {TestCase[]}
     */
    get testCases() {
      return this._testCases;
    }

    /**
     * テストケースを追加する
     * @param {string} name テストケース名
     * @param {boolean} isAuto 自動テストかどうか
     */
    addTestCase(name, isAuto) {
      this._testCases.push(new TestCase(name, isAuto));
    }

    /**
     * テストケースの結果を操作する
     * @param {string} name テストケース名
     * @param {boolean} isSuccessed 成功かどうか
     * @param {string[]} reasons 失敗理由
     */
    doTest(name, isSuccessed, reasons) {
      const testCase = this.findTestCase(name);
      if (!testCase) {
        return;
      }
      if (isSuccessed) {
        testCase.success();
      } else {
        testCase.fail(reasons);
      }
    }

    /**
     * テストケースを名前で検索する
     * @param {string} name テストケース名
     * @return {TestCase}
     */
    findTestCase(name) {
      return this.testCases.find((testCase) => testCase.name === name);
    }

    /**
     * 全テストケースを未実行にする
     */
    resetResults() {
      this._testCases.forEach((testCase) => testCase.reset());
    }
  }

  /**
   * テストケース
   */
  class TestCase {
    constructor(name, isAuto) {
      this._name = name;
      this._isAuto = isAuto;
      this._status = TESTCASE_STATUS.NOT_YET;
      this._messages = [];
    }

    get name() {
      return this._name;
    }

    /**
     * @return {string[]}
     */
    get messages() {
      return this._messages;
    }

    /**
     * 自動テストであるか
     * @return {boolean}
     */
    isAuto() {
      return this._isAuto;
    }

    /**
     * 成功したか
     * @return {boolean}
     */
    isSuccessed() {
      return this._status === TESTCASE_STATUS.SUCCESSED;
    }

    /**
     * 失敗したか
     * @return {boolean}
     */
    isFaild() {
      return this._status === TESTCASE_STATUS.FAILED;
    }

    /**
     * 実行済みか
     * @return {boolean}
     */
    isDone() {
      return this._status !== TESTCASE_STATUS.NOT_YET;
    }

    /**
     * 目視確認用
     *
     * 実行結果をトグルする
     * 未実行または失敗の場合、成功にする
     * 成功の場合、失敗にする
     */
    toggle() {
      if (!this.isDone()) {
        this.success();
      } else if (this.isSuccessed()) {
        this.fail();
      } else {
        this.success();
      }
    }

    /**
     * 成功状態にする
     */
    success() {
      this._status = TESTCASE_STATUS.SUCCESSED;
      this._messages = ['テストは成功しました'];
    }

    /**
     * 失敗状態にする
     */
    fail(reasons) {
      this._status = TESTCASE_STATUS.FAILED;
      this._messages = reasons || ['テストは失敗しました'];
    }

    /**
     * 未実行状態にする
     */
    reset() {
      this._status = TESTCASE_STATUS.NOT_YET;
    }

    /**
     * 実行形式（AUTOまたはMANUAL）の文字列の色を返す
     * @return {string}
     */
    autoOrManualColor() {
      return this.isAuto() ? ColorManager.autoColor() : ColorManager.manualColor();
    }

    /**
     * 結果を文字列で返す
     * @return {string}
     */
    statusText() {
      if (!this.isDone()) {
        return 'NOT YET';
      }
      return this.isSuccessed() ? 'OK' : 'FAILED';
    }

    /**
     * 結果文字列の色を返す
     * @return {string}
     */
    statusTextColor() {
      if (!this.isDone()) {
        return ColorManager.pendingColor();
      }
      return this.isSuccessed() ? ColorManager.powerUpColor() : ColorManager.powerDownColor();
    }
  }

  window[TestTargetPlugins.name] = TestTargetPlugins;
  window[TestTargetPlugin.name] = TestTargetPlugin;
  window[TestCase.name] = TestCase;

  const testTargetPlugins = new TestTargetPlugins();
  window.$testTargetPlugins = testTargetPlugins;

  const _Scene_Boot_initialize = Scene_Boot.prototype.initialize;
  Scene_Boot.prototype.initialize = function () {
    _Scene_Boot_initialize.call(this);
    PluginManager.setupTestPlugins($plugins);
    this._testScriptsLoaded = false;
  };

  Scene_Boot.prototype.defineTestCase = function () {
    // DO NOTHING
  };

  Scene_Boot.prototype.doTestOnBoot = function () {
    // DO NOTHING
  };

  const _Scene_Boot_isReady = Scene_Boot.prototype.isReady;
  Scene_Boot.prototype.isReady = function () {
    /**
     * 各種ロード待ち
     */
    if (!this._testScriptsLoaded) {
      if (PluginManager.testScriptsLoaded()) {
        this._testScriptsLoaded = true;
        this.defineTestCase();
      }
      return false;
    }
    this.doTestOnBoot();
    return _Scene_Boot_isReady.call(this);
  };

  class Scene_TestCase extends Scene_Base {
    create() {
      super.create();
      this.createWindowLayer();
      this.createTargetPluginsWindow();
      this.createTestCaseWindow();
      this.createReasonWindow();
    }

    start() {
      super.start();
      this._targetPluginsWindow.select(0);
      this._testCaseWindow.select(0);
      this._targetPluginsWindow.activate();
    }

    createTargetPluginsWindow() {
      this._targetPluginsWindow = new Window_TargetPlugins(this.targetPluginsWindowRect());
      this._targetPluginsWindow.setHandler('ok', this.onTargetPluginsOk.bind(this));
      this._targetPluginsWindow.setHandler('cancel', this.popScene.bind(this));
      this.addWindow(this._targetPluginsWindow);
    }

    createTestCaseWindow() {
      this._testCaseWindow = new Window_TestCase(this.testCaseWindowRect());
      this._testCaseWindow.setHandler('ok', this.onTestCaseOk.bind(this));
      this._testCaseWindow.setHandler('cancel', this.onTestCaseCancel.bind(this));
      this._targetPluginsWindow.setTestCaseWindow(this._testCaseWindow);
      this.addWindow(this._testCaseWindow);
    }

    createReasonWindow() {
      this._reasonWindow = new Window_Help(this.reasonWindowRect());
      this._testCaseWindow.setHelpWindow(this._reasonWindow);
      this._testCaseWindow.updateHelp();
      this.addWindow(this._reasonWindow);
    }

    onTargetPluginsOk() {
      this._targetPluginsWindow.deactivate();
      this._testCaseWindow.activate();
    }

    onTestCaseOk() {
      testTargetPlugins.targetPlugins[this._targetPluginsWindow.index()].testCases[
        this._testCaseWindow.index()
      ].toggle();
      this._testCaseWindow.activate();
      this._testCaseWindow.refresh();
    }

    onTestCaseCancel() {
      this._testCaseWindow.deactivate();
      this._targetPluginsWindow.activate();
    }

    targetPluginsWindowRect() {
      return new Rectangle(0, 0, Graphics.boxWidth, this.calcWindowHeight(5, true));
    }

    testCaseWindowRect() {
      const y = this._targetPluginsWindow.height;
      return new Rectangle(0, y, Graphics.boxWidth, Graphics.boxHeight - y - this.reasonWindowHeight());
    }

    reasonWindowRect() {
      const y = this._testCaseWindow.y + this._testCaseWindow.height;
      return new Rectangle(0, y, Graphics.boxWidth, this.reasonWindowHeight());
    }

    reasonWindowHeight() {
      return this.calcWindowHeight(3, false);
    }
  }

  class Window_TargetPlugins extends Window_Selectable {
    initialize(rect) {
      super.initialize(rect);
      this.refresh();
    }

    setTestCaseWindow(testCaseWindow) {
      this._testCaseWindow = testCaseWindow;
    }

    maxItems() {
      return testTargetPlugins.targetPlugins.length;
    }

    drawItem(index) {
      const rect = this.itemRect(index);
      const targetPlugin = this.item(index);
      this.drawText(`${targetPlugin.name}`, rect.x, rect.y, this.width);
      this.drawText(
        `${targetPlugin.version}`,
        rect.x,
        rect.y,
        this.width - this.textWidth(targetPlugin.version),
        'right'
      );
    }

    item(index) {
      return testTargetPlugins.targetPlugins[index];
    }

    select(index) {
      super.select(index);
      this.updateTestCaseWindow();
    }

    updateTestCaseWindow() {
      if (this._testCaseWindow) {
        this._testCaseWindow.setTargetPlugin(this.item(this.index()));
      }
    }
  }

  class Window_TestCase extends Window_Selectable {
    initialize(rect) {
      super.initialize(rect);
      this._targetPlugin = testTargetPlugins.targetPlugins[0];
      this.refresh();
    }

    setTargetPlugin(targetPlugin) {
      this._targetPlugin = targetPlugin;
      this.refresh();
      this.updateHelp();
    }

    maxItems() {
      return this._targetPlugin.testCases.length;
    }

    isCurrentItemEnabled() {
      return !this._targetPlugin.testCases[this.index()].isAuto();
    }

    drawItem(index) {
      const rect = this.itemLineRect(index);
      const testCase = this._targetPlugin.testCases[index];
      this.changeTextColor(testCase.autoOrManualColor());
      this.drawText(testCase.isAuto() ? 'AUTO' : 'MANUAL', rect.x, rect.y, 100);
      this.resetTextColor();
      this.drawText(testCase.name, rect.x + 100, rect.y, this.width - rect.x);
      this.changeTextColor(testCase.statusTextColor());
      this.drawText(testCase.statusText(), rect.x, rect.y, this.width - this.textWidth('FAILED'), 'right');
    }

    updateHelp() {
      super.updateHelp();
      const testCase = this._targetPlugin.testCases[this.index()];
      if (testCase) {
        this._helpWindow.setText(testCase.messages.join('\n'));
      } else {
        this._helpWindow.setText('');
      }
    }
  }

  class TestSpec {
    constructor(tests, getValue, targetName, expected) {
      this._tests = tests;
      this._getValue = getValue;
      this._targetName = targetName;
      this._expected = expected;
    }

    /**
     * @param {Function[]} tests テストメソッド一覧
     * @param {Function} getValue テスト対象値取得関数
     * @param {string} targetName テスト対象名
     * @param {any} expected 期待する値（任意）
     * @return {TestSpec}
     */
    static instance(tests, getValue, targetName, expected) {
      return new TestSpec(tests, getValue, targetName, expected);
    }

    /**
     * IDのためのスペックを取得する（0より大の整数値）
     * @param {Function} getValue テスト対象取得関数
     * @param {string} targetName テスト対象名
     * @return {TestSpec}
     */
    static id(getValue, targetName) {
      return new TestSpec([TestResult.mustBeInteger, TestResult.mustBeGreaterThanZero], getValue, targetName);
    }

    /**
     * 要素を持つ配列のためのスペックを取得する
     * @param {Function} getValue テスト対象取得関数
     * @param {string} targetName テスト対象名
     * @return {TestSpec}
     */
    static arrayWithElement(getValue, targetName) {
      return new TestSpec([TestResult.mustBeArray, TestResult.mustBeWithAtLeastOneElement], getValue, targetName);
    }

    /**
     * @return {TestResult[]}
     */
    doTest() {
      return this._tests.map((test) => test(this._getValue(), this._targetName, this._expected));
    }
  }

  /**
   * テスト用メソッドを提供する
   */
  class TestResult {
    constructor(status, message) {
      this._status = status;
      this._message = status ? TestResultMessage.success() : message;
    }

    /**
     * @return {boolean}
     */
    get status() {
      return this._status;
    }

    /**
     * @return {TestResultMessage}
     */
    get message() {
      return this._message;
    }

    static mustBeArray(value, name) {
      return new TestResult(Array.isArray(value), TestResultMessage.notArray(name));
    }

    static mustBeWithAtLeastOneElement(value, name) {
      return new TestResult(value.length > 0, TestResultMessage.noElement(name));
    }

    static mustBeInteger(value, name) {
      return new TestResult(Number.isInteger(value), TestResultMessage.notInteger(name));
    }

    static mustBeNumber(value, name) {
      return new TestResult(Number.isFinite(value), TestResultMessage.notNumber(name));
    }

    static mustBeZero(value, name) {
      return new TestResult(value === 0, TestResultMessage.notValue(name, 0));
    }

    static mustBeValue(value, name, expected) {
      return new TestResult(value === expected, TestResultMessage.notValue(name, expected));
    }

    static mustBeGreaterThanZero(value, name) {
      return new TestResult(value > 0, TestResultMessage.lessThanOrEqualZero(name));
    }

    static mustBeBoolean(value, name) {
      return new TestResult(typeof value === 'boolean', TestResultMessage.notBoolean(name));
    }

    static mustBeTrue(value, name) {
      return new TestResult(value === true, TestResultMessage.notValue(name, true));
    }

    static mustBeFalse(value, name) {
      return new TestResult(value === false, TestResultMessage.notValue(name, false));
    }

    static mustBeString(value, name) {
      return new TestResult(typeof value === 'string', TestResultMessage.notString(name));
    }
  }

  /**
   * 失敗理由を返す
   */
  class TestResultMessage {
    constructor(text) {
      this._text = text;
    }

    get text() {
      return this._text;
    }

    static success() {
      return new TestResultMessage('テストは成功しました');
    }

    static notArray(name) {
      return new TestResultMessage(`${name}が配列ではありません。`);
    }

    static noElement(name) {
      return new TestResultMessage(`${name}に要素が1つもありません。`);
    }

    static notInteger(name) {
      return new TestResultMessage(`${name}が整数ではありません。`);
    }

    static notNumber(name) {
      return new TestResultMessage(`${name}が数値型ではありません。`);
    }

    static notValue(name, value) {
      return new TestResultMessage(`${name}の値が${value}ではありません。`);
    }

    static lessThanOrEqualZero(name) {
      return new TestResultMessage(`${name}が0以下です。`);
    }

    static notBoolean(name) {
      return new TestResultMessage(`${name}が真偽値ではありません。`);
    }

    static notString(name) {
      return new TestResultMessage(`${name}が文字列ではありません。`);
    }
  }

  window[TestSpec.name] = TestSpec;
  window[TestResult.name] = TestResult;
  window[TestResultMessage.name] = TestResultMessage;
})();
