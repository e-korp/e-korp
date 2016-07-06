#!/bin/bash
set -eu

echo "Starting MongoDB dump..."

DUMPFILE=ekorp_mongo_1_backup-`date +%F`.archive
docker exec ekorp_mongo_1 mongodump --db ekorp --archive > /tmp/$DUMPFILE

echo "Uploading to S3..."

export AWS_ACCESS_KEY_ID="AKIAJIMMS2SR7OEB7JIQ"
export AWS_SECRET_ACCESS_KEY="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"

/usr/local/bin/aws s3 cp /tmp/$DUMPFILE s3://backups-nakd-com/watcher/$DUMPFILE

echo "Removing local dumpfile..."
rm /tmp/$DUMPFILE

echo "Backup done"
