/**
 * version
 *   TorigoyaMZ_FrameTween.js: 2.2.1
 *   TorigoyaMZ_NotifyMessage.js: 1.6.1
 */
declare namespace Torigoya {
  namespace FrameTween {
    class Tween {
      static create(target: any, initialParams): Tween;
      group(group: Group): Tween;
      to (params: { y?: number }, duration: number, easingFunc: (n: number) => number): Tween;
      start(): Tween;
      abort(): Tween;
    }
    class Group {
      
    }
    var Easing: {
      easeInOutQuad: (n: number) => number;
    };
    function create(target: any): Tween;
  }

  type NotifyItemParameter = {
    message?: string;
    icon: number;
    note?: string;
  };
  namespace NotifyMessage {
    type NotifyStack = {
      notifyItem: NotifyItem;
      window: Window_NotifyMessage;
      y: number;
    };
    class NotifyItem {
      constructor(params: NotifyItemParameter);
    }

    class NotifyManagerClass {
      _stacks: NotifyStack[];
      _scrollAnimations: FrameTween.Tween[];
      _group: FrameTween.Group;

      _setupWindow(notifyItem: NotifyItem): Window_NotifyMessage;
      _destroyStack(stack: NotifyStack): void;

      itemMargin(): number;
      isVisible(): boolean;
      notify(notifyItem: NotifyItem): void;
      startScrollAnimation(newWindowHeight: number): void;
    }

    class Window_NotifyMessage extends Window_Base {
    }

    var parameter: {
      version: string;
      baseAppearTime: number;
      advancedAppendScenes: string[];
    };
    var Manager: NotifyManagerClass;
    var Window: Window_NotifyMessage;
  }
}


