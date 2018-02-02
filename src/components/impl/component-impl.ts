export class ComponentImpl<T> {
  constructor(component: T) {
    this._component = component;
  }

  private _component: T;

  get component(): T {
    return this._component;
  }
}
