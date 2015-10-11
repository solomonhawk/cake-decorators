import * as cake from '../cake'

let propDescriptor = Object.getOwnPropertyDescriptor

describe('cake', function() {
  ['writable', 'enumerable', 'configurable'].forEach(basicDescriptorPropertyTestFactory)

  describe('memoize', function() {
    let { memoize } = cake

    it('memoizes getters and setters', function() {
      let getterMock = sinon.mock()
      let setterMock = sinon.mock()

      class Person {
        constructor(first, last) {
          this.first = first
          this.last  = last
        }

        @memoize
        get name() {
          getterMock()
          return `${ this.first } ${ this.last }`
        }

        set name(name) {
          setterMock()
          let [first, last] = name.split(' ')
          this.first = first
          this.last = last
        }
      }

      let batman = new Person('Bruce', 'Wayne')

      // access name 3 times, first call triggers actual getter,
      // subsequent calls return the memoized value
      batman.name
      batman.name
      batman.name

      // set name to 'Batman', subsequent assignments won't trigger
      // setter since value is the same
      batman.name = 'The Batman'
      batman.name = 'The Batman'
      batman.name = 'The Batman'

      assert.ok(getterMock.calledOnce)
      assert.ok(setterMock.calledOnce)
    })
  })

  describe('localStorageDriver', function() {
    let { localStorageDriver } = cake

    let store = {}

    let mock = {
      getItem(key) {
        return store[key]
      },
      setItem(key, val) {
        store[key] = val
      },
      clear() {
        store = {}
      }
    }

    Object.defineProperty(window, 'localStorage', {
      configurable : true,
      enumerable   : true,
      writable     : true,
      value        : mock
    })

    afterEach(() => {
      mock.clear()
    })

    it('set calls localStorage.setItem', function() {
      let spy = sinon.spy(localStorage, 'setItem')

      localStorageDriver.set('foo', 'bar')

      assert.ok(spy.called)
    })

    it('get calls localStorage.getItem', function() {
      let spy = sinon.spy(localStorage, 'getItem')

      localStorageDriver.set('foo', 1)

      let result = localStorageDriver.get('foo')

      assert.ok(spy.called)
      assert.equal(result, 1)
    })
  })

  describe('cache', function() {
    let { cacheSync, localStorageDriver:ls } = cake

    it('caches function calls with the same key', function() {
      let mock = sinon.mock()

      let foo = {
        @cacheSync(ls, ({ slug }) => slug)
        expensiveFunction({ slug }) {
          // ... expensive ...
          mock()
          return "Really Expensive " + slug
        }
      }

      foo.expensiveFunction({ slug: 'foo' })
      foo.expensiveFunction({ slug: 'foo' })
      foo.expensiveFunction({ slug: 'foo' })

      assert.ok(mock.calledOnce)
    })
  })
})

/**
 * 'writable', 'enumerable', and 'configurable' all behave the same
 * so their shared functionality is described by this test factory.
 **/
function basicDescriptorPropertyTestFactory(propertyName) {
  describe(propertyName, function() {
    let decoratorFactory = cake[propertyName]

    it('returns a decorator function', function() {
      let decorator = decoratorFactory(true)
      let result    = decorator({}, 'foo', { [propertyName]: false })

      // decorator functions have an arity of 3, (target, name, descriptor)
      assert.equal(decorator.length, 3)
      // it modifies a decorator descriptor
      assert.equal(result[propertyName], true)
    })


    it('when passed "false", sets the "' + propertyName+ '" property to false', function() {
      class A {
        @decoratorFactory(false)
        foo() {}
      }

      let result = propDescriptor(A.prototype, 'foo')[propertyName]

      assert.equal(result, false)
    })


    it('when passed "true", sets the "' + propertyName+ '" property to true', function() {
      let A = {}

      // non-writable descriptor
      let descriptor = {
        configurable : false,
        enumerable   : false,
        writable     : false,
        value        : function foo() {}
      }

      // apply writable(true) descriptor and define property
      descriptor = decoratorFactory(true)(A, 'foo', descriptor) || descriptor
      Object.defineProperty(A, 'foo', descriptor)

      // check the result
      let result = propDescriptor(A, 'foo')[propertyName]
      assert.equal(result, true)
    })
  })
}

