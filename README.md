# E-korp

### Requirements
Nodejs version 6.0.0 to support ES6 features.


### Setup using Docker
Check out [e-korp-docker](https://github.com/e-korp/e-korp-docker) for
instructions.


### Node.js, ES6 etc
We are using co.wrap to be able to yield promises. This is going to be
swapped out when async/await comes native in node.js. We could have used
babel to transpile the code to ES5 but it becomes messy to debug and the
performance is terrible.

### Tests
Run and watch tests with `npm test`

Tests are placed inside the `tests/` directory with the same structure as the
`src` directory. Test files should be named `{name}.test.js`
