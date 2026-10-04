/// <reference path="../../../typings/rmmz.d.ts" />

declare interface Scene_Base {
  _messageWindowLayer: WindowLayer;
  _messageWindow: Window_Message;
  _goldWindow: Window_Gold;
  _nameBoxWindow: Window_NameBox;
  _choiceListWindow: Window_ChoiceList;
  _numberInputWindow: Window_NumberInput;
  _eventItemWindow: Window_EventItem;

  mustCreateMessageWindow(): boolean;
  isMessageWindowClosing(): boolean;
  createMessageWindows(): void;

  createMessageWindow(): void;
  messageWindowRect(): Rectangle;
  createGoldWindow(): void;
  goldWindowRect(): Rectangle;
  createNameBoxWindow(): void;
  createChoiceListWindow(): void;
  createNumberInputWindow(): void;
  createEventItemWindow(): void;
  eventItemWindowRect(): Rectangle;
  associateWindows(): void;

  messageWindowAssociatedGoldWindowOptions(): Window_Message_AssociatedWindowOptions;
  /**
   * @depreceated
   */
  mustKeepGoldWindowY(): boolean;
}

declare interface Window_Selectable {
  _messageWindow: Window_Message|undefined;
  _deactivatedByMessage: boolean;

  isAssociatedWithMessageWindow(): boolean;
}

type Window_Message_AssociatedWindowOptions = {
  keepGoldWindowY?: boolean;
  keepGoldWindowOpen?: boolean;
};

declare interface Window_Message {
  _associatedWindowOptions?: Window_Message_AssociatedWindowOptions;

  setAssociatedWindowOptions(options: Window_Message_AssociatedWindowOptions): void;
  defaultAssociatedWindowOptions(): Window_Message_AssociatedWindowOptions;
  associatedWindowOptions(): Window_Message_AssociatedWindowOptions;

  keepGoldWindowY(): boolean;
  keepGoldWindowOpen(): boolean;

  /**
   * @deprecated use setAssociatedWindowOptions
   */
  setMustKeepGoldWindowY(mustKeep: boolean): void;
}
