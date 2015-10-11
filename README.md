Cake ![Build Status](https://circleci.com/gh/solomonhawk/cake-decorators.png?style=shield&circle-token=0a4187fbf80068ccf6b7d542ee87e56755c05910)
====
Delicious ES7 decorators.

### [WIP] - Still Baking..

# Brief Example

```js
// ES6/7
import { cache, localStorageDriver:ls } from 'cake-decorators'

class FooFetcher {
    @cache(ls)
    fetch(id) {
        // expensive operation
        // ...
        // ...
        // ...
        return 'bar'
    }
}

let fetcher = new FooFetcher()

fetcher.fetch('foo') // invokes the actual fetch method
localStorage.foo     // 'bar'

fetcher.fetch('foo') // returns the cached value from localStorage
fetcher.fetch('foo') // the same as above

fetcher.fetch('bar') // invokes the actual fetch method (since the argument is different)
```

