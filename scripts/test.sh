#!/bin/bash
node_modules/.bin/mocha $(find . -name *test.js ! -ipath '*node_modules*')
