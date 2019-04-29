export default class Logger {
  _listeners: Function[] = [];

  Follow(fn: Function) {
    this._listeners.push(fn);
  }

  Log(...msg: any[]) {
    this._listeners.forEach(fn => {
      fn([...msg]);
    });
  }
}
