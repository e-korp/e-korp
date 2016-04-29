# E-korp


### Node.js, ES6 etc
Using --harmony_default_parameters to enable default variables. This will be
available in Node.js 6.0

We can use `import from` syntax in tests since we have babel there. In the
actual project we use require and module.exports

We are using co.wrap to be able to yield promises. This is going to be
swapped out when async/await comes native in node.js. We could have used
babel to transpile the code to ES5 but it becomes messy to debug and the
performance is terrible.


### Development environment
Docker?


### Authentication



### Resources
- RESTful


### Models
- Extendable


### Tests
Run tests with `npm test`

Tests are placed inside the `tests/` directory with the same structure as the
`src` directory. Test files should be named `{name}.test.js`
