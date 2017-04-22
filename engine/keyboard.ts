class KeyInfo {
  [key: string]: boolean;

  static Keys: string[] =
  "QWERTYUIOPASDFGHJKLZXCVBNM".split("")
    .concat("Spacebar")
    .concat("Up")
    .concat("Down")
    .concat("Left")
    .concat("Right");

  Q       : boolean;
  W       : boolean;
  E       : boolean;
  R       : boolean;
  T       : boolean;
  Y       : boolean;
  U       : boolean;
  I       : boolean;
  O       : boolean;
  P       : boolean;
  A       : boolean;
  S       : boolean;
  D       : boolean;
  F       : boolean;
  G       : boolean;
  H       : boolean;
  J       : boolean;
  K       : boolean;
  L       : boolean;
  Z       : boolean;
  X       : boolean;
  C       : boolean;
  V       : boolean;
  B       : boolean;
  N       : boolean;
  M       : boolean;

  Up      : boolean;
  Down    : boolean;
  Left    : boolean;
  Right   : boolean;
  Spacebar: boolean;
}

interface QueuedKeyboardEvent {
  isDown: boolean;
  event : KeyboardEvent;
}

class Keyboard {
  public down     = new KeyInfo();
  public justDown = new KeyInfo();

  private _queuedEvents: QueuedKeyboardEvent[] = [];

  constructor() {
    addEventListener("keydown", e => this.keyDown(e), false);
    addEventListener("keyup",   e => this.keyUp(e),   false);
  }

  private keyUp(e: KeyboardEvent) {
    // Since events happen asynchronously, we simply queue them up
    // to be processed on the next update cycle.

    this._queuedEvents.push({ event: e, isDown: false });
  }

  private keyDown(e: KeyboardEvent) {
    this._queuedEvents.push({ event: e, isDown: true });
  }

  private eventToKey(event: KeyboardEvent): string {
    const number = event.keyCode || event.which;
    let str: string;

    switch (number) {
      case 37: str = "Left"; break;
      case 38: str = "Up"; break;
      case 39: str = "Right"; break;
      case 40: str = "Down"; break;

      /* A-Z */
      default: str = String.fromCharCode(number);
    }

    if (str === " ") {
      return "Spacebar";
    }

    if (str.length == 1) {
      return str.toUpperCase();
    }

    return str[0].toUpperCase() + str.slice(1);
  }

  update(): void {
    for (const key of KeyInfo.Keys) {
      this.justDown[key] = false;
    }

    for (const queuedEvent of this._queuedEvents) {
      const key = this.eventToKey(queuedEvent.event);

      if (queuedEvent.isDown) {
        if (!this.down[key]) {
          this.justDown[key] = true;
        }

        this.down[key]     = true;
      } else {
        this.down[key]     = false;
      }
    }

    this._queuedEvents = [];
  }

  clear(key: string): void {
    this.justDown[key] = false;
  }
}