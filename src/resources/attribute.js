class Attribute {

  constructor(name, value, configurable = false) {
    this._name = name;
    this._value = value;
    this._configurable = configurable;
  }

  /**
   * Getters and setters
   */


  get name() {
    return this._name;
  }

  set name(name) {
    this._name = name;
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
  }

  get configurable() {
    return this._configurable;
  }

  set configurable(configurable) {
    this._configurable = configurable;
  }

}

module.exports = Attribute;
