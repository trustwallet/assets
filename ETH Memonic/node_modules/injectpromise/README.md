# injectpromise

A minimalistic package to insert a promise instead of using a callback.

### Usage

```javascript

const injectPromise = require('injectpromise')

class SomeClass {

    constructor() {
        this.injectPromise = injectPromise(this);
    }

    async getCurrent(callback = false) {

        if (!callback)
            return this.injectPromise(this.getCurrent);

        callSomething
            .then(result => {
            callback(null, result);
        }).catch(err => callback(err));
    }

}

module.exports = SomeClass


``` 
