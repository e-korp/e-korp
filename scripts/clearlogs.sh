#!/bin/bash
set -eu

echo "Cleaning logs"
docker exec ekorp_mongo_1 mongo ekorp --eval 'db.logs.remove({});'
echo "Clearing done"
