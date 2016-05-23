#!/bin/bash
./node_modules/.bin/nodemon --exec "./node_modules/.bin/mocha $(find . -name '*.spec.js' ! -ipath '*node_modules*')"
