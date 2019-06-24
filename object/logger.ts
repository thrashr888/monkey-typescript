export default class Logger {
  private _listeners: Function[] = [];

  Follow(fn: Function) {
    this._listeners.push(fn);
  }

  Log(...messages: any[]) {
    let date = new Date();
    this._listeners.forEach(fn => {
      fn(date, [...messages]);
    });
  }
}
