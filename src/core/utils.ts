export function defineImplementation(component: any, impl: any) {
  Object.getOwnPropertyNames(impl.prototype).forEach(name => {
      if (typeof impl.prototype[name] === "function" && name !== "constructor") {
        component.prototype[name] = function () {
          const implObj = this._getImpl();
          return implObj[name].apply(implObj, arguments);
        };
      }
  });

  component.prototype._getImpl = function () {
    if (!this._implObj) {
      this._implObj = new impl(this);
    }
    return this._implObj;
  }
}
