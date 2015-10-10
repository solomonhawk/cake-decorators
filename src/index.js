/**
 * Cake - Recipes for configurable decorators
 **/

/** utility **/
export function identity(value) {
  return value
}

/** class property decorators **/

/**
 * @function enumerable
 * @type decorator
 * @param { Boolean } value - whether the property is enumerable or not
 * @return { DecoratorFunction }
 **/
export function enumerable(value) {
  return function (target, key, descriptor) {
     descriptor.enumerable = value
     return descriptor
  }
}

/**
 * @function configurable
 * @type decorator
 * @param { Boolean } value - whether the property is configurable or not
 * @return { DecoratorFunction }
 **/
export function configurable(value) {
  return function (target, key, descriptor) {
     descriptor.configurable = value
     return descriptor
  }
}

/**
 * @function writable
 * @type decorator
 * @param { Boolean } value - whether the property is writable or not
 * @return { DecoratorFunction }
 **/
export function writable(value) {
  return function (target, key, descriptor) {
     descriptor.writable = value
     return descriptor
  }
}

/**
 * Hash for memoized getters / setters
 **/
let memoized = new WeakMap()

/**
 * @function memozie
 * @source https://github.com/wycats/javascript-decorators
 * @type decorator
 * @param { Boolean } value - whether the property is enumerable or not
 * @return { Void }
 **/
export function memoize(target, name, descriptor) {
  let getter = descriptor.get, setter = descriptor.set

  descriptor.get = function() {
    let table = memoizationFor(this)
    if (name in table) { return table[name] }
    return table[name] = getter.call(this)
  }

  descriptor.set = function(val) {
    let table = memoizationFor(this)
    setter.call(this, val)
    table[name] = val
  }
}

function memoizationFor(obj) {
  let table = memoized.get(obj)

  if (!table) {
    table = Object.create(null)
    memoized.set(obj, table)
  }

  return table
}

/**
 * @function cache
 * @source https://github.com/wycats/javascript-decorators
 * @type decorator
 * @param { Object } driver - format is { get: Function, set: Function }
 * @param { Function } getKey - method that returns the unique identifier
 * @return { DescriptorFunction }
 **/
export function cacheSync({ get, set }, getKey) {
  return function (target, name, descriptor) {
    let fn = descriptor.value

    descriptor.value = function cachedDecoratedMethod(params) {
      let key    = getKey(params)
      let cached = get(key)

      if (cachedValue) {
        return cachedValue
      } else {
        let result = fn.call(target, params)
        set(key, result)
        return result
      }
    }

    return descriptor
  }
}

/**
 * @function cache
 * @source https://github.com/wycats/javascript-decorators
 * @type decorator
 * @param { Object } driver - format is { get: Function, set: Function }
 * @param { Function } getKey - method that returns the unique identifier
 * @return { DescriptorFunction }
 **/
export function cache({ get, set }, getKey) {
  return function (target, name, descriptor) {
    let fn = descriptor.value

    descriptor.value = async function cachedDecoratedMethod(params) {
      let key    = getKey(params)
      let cached = await get(key)

      if (cachedValue) {
        return cachedValue
      } else {
        let result = await fn.call(target, params)
        await set(key, result)
        return result
      }
    }

    return descriptor
  }
}

export const localStorageDriver = {
  get(key) {
    localStorage.getItem(key)
  },

  set(key, value) {
    localStorage.setItem(key, value)
  }
}


