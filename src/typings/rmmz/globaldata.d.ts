/**
 * MIT License
 * Copyright (c) 2020 LunaTechsDev
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
/** @global RPGMaker Plugin's Object */
declare var $plugins: Array<MZ.PluginSettings>;
/** @global RPGMakerMV Actor data. */
declare var $dataActors: Array<MZ.Actor>;
/** @global RPGMakerMV Class data. */
declare var $dataClasses: Array<MZ.RPGClass>;
/** @global RPGMakerMV Skill data. */
declare var $dataSkills: Array<MZ.Skill>;
/** @global RPGMakerMV Item data. */
declare var $dataItems: Array<MZ.Item>;
/** @global RPGMakerMV Weapon data. */
declare var $dataWeapons: Array<MZ.Weapon>;
/** @global RPGMakerMV Armor data. */
declare var $dataArmors: Array<MZ.Armor>;
/** @global RPGMakerMV Enemy data. */
declare var $dataEnemies: Array<MZ.Enemy>;
/** @global RPGMakerMV Troop data. */
declare var $dataTroops: Array<MZ.Troop>;
/** @global RPGMakerMV State data. */
declare var $dataStates: Array<MZ.State>;
/** @global RPGMakerMV Animation data. */
declare var $dataAnimations: Array<MZ.Animation>;
/** @global RPGMakerMV Tileset data. */
declare var $dataTilesets: Array<MZ.Tileset>;
/** @global RPGMakerMV CommonEvent data. */
declare var $dataCommonEvents: Array<MZ.CommonEvent>;
/** @global RPGMakerMV System data. */
declare var $dataSystem: System;
/** @global RPGMakerMV MapInfo data. */
declare var $dataMapInfos: Array<MapInfo>;
/** @global RPGMakerMV Map data for the current map. */
declare var $dataMap: MZ.Map;
/** @global RPGMakerMV Temporary game data; not saved with the game. */
declare var $gameTemp: Game_Temp;
/** @global RPGMakerMV Game System data; saved with the game.
 * @type {Game_Temp}
 */
declare var $gameSystem: Game_System;
/** @global RPGMakerMV Game Screen; contains properties and methods
 * for adjusting the game screen.
 * @type {Game_Screen}
 */
declare var $gameScreen: Game_Screen;
declare var $gameTimer: Game_Timer;
/** @global RPGMakerMV Game Message; contains properties and methods
 * for displaying messages in the game message window.
 * @type {Game_Message}
 */
declare var $gameMessage: Game_Message;
/** @global RPGMakerMV Game Switches; contains properties and methods
 * for modifying in game switches while the game is running.
 * These are boolean values: true or false.
 * @type {Game_Switches}
 */
declare var $gameSwitches: Game_Switches;
/** @global RPGMakerMV Game Variables; contains properties and methods
 * for modifying the values of game variables.
 * The variables can contain anything.
 * @type {Game_Variables}
 */
declare var $gameVariables: Game_Variables;
declare var $gameSelfSwitches: Game_SelfSwitches;
declare var $gameActors: Game_Actors;
/** @global RPGmakerMV Game Party; contains properties and methods
 * for interacting with the game party. Some of the methods include
 * number of party members, etc.
 * @type {Game_Party}
 */
declare var $gameParty: Game_Party;
/** @global RPGMakerMV Game Troop; contains properties and methods
 * for interacting with the game troops. Some of the methods include
 * enemy data, enemy names, etc.
 * @type {Game_Troop}
 */
declare var $gameTroop: Game_Troop;
/** @global RPGMakerMV Game Map; contains properties and methods
 * for interacting with the game map. Some of these methods include
 * interacting with the map's game_interpreter, and event information.
 * @type {Game_Map}
 */
declare var $gameMap: Game_Map;
/** @global RPGMakerMV Game Player; contains properties and methods
 * for interacting with the game player. Some of these methods
 * include interacting with the player's position and move route.
 * @type {Game_Player}
 */
declare var $gamePlayer: Game_Player;
declare var $testEvent: Array<MZ.EventCommand>;
