/// <reference path="../../typings/rmmz.d.ts" />

declare namespace MZ {
  interface Actor {
    orderId: number;
  }

  interface Class {
    orderId: number;
  }

  interface Enemy {
    orderId: number;
  }

  interface Troop {
    orderId: number;
  }

  interface Item {
    orderId: number;
  }

  interface Weapon {
    orderId: number;
  }

  interface Armor {
    orderId: number;
  }

  interface Skill {
    orderId: number;
  }

  interface State {
    orderId: number;
  }

  interface Map {
    orderId: number;
  }

  interface Event {
    orderId: number;
  }
}

type OrderIdHolder = MZ.Actor | MZ.Class | MZ.Enemy | MZ.Item | MZ.Weapon | MZ.Armor | MZ.Skill | MZ.State | MZ.Event;
