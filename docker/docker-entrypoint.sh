#!/bin/bash

echo "Ekorp entrypoint"

echo "Rebuilding dependencies..."
rm -rf ./node_modules
npm install

# Default to development
processfile="./docker/processes.dev.json"

if [ "$NODE_ENV" = "production" ]
  then
    echo "Running production mode"
    processfile="./docker/processes.prod.json"
elif [ "$NODE_ENV" = "development" ]
  then
  echo "Running development mode"
else
  echo "No mode set. Setting to development mode"
  NODE_ENV=development
fi

if [ "$NODE_ENV" = "development" ]
  then
    echo "Starting debugging server"
    node-debug --cli --debug-brk false ../ekorp/main.js
fi

echo "Using instructions from $processfile for PM2"

# Run app
pm2 start "$processfile"
pm2 logs
