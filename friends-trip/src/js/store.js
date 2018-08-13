import debounce from "lodash/debounce";

export default class Store {
  save = debounce(value => {
    this.setItem(this.key, value);
  }, 0);

  handler = {
    get: (target, property) => {
      return target[property];
    },
    set: (target, property, value) => {
      target[property] = value;

      this.save(target);
      return true;
    }
  };

  getItem = key => {
    const valueRaw = window.localStorage.getItem(key);
    var value = JSON.parse(valueRaw);
    return value || null;
  };

  setItem = (key, value) => {
    const valueRaw = JSON.stringify(value);
    window.localStorage.setItem(key, valueRaw);
  };

  constructor(key, initialValue) {
    this.key = key;
    const value = this.getItem(this.key) || initialValue;
    return new Proxy(value, this.handler);
  }
}

//todo: make as a part of store
export function clearStore(target) {
  Object.keys(target).forEach(function(key) {
    delete target[key];
  });
  return target;
}
