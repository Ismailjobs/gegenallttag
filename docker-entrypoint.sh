#!/bin/sh
set -e
mkdir -p /app/data /app/data/uploads
node node_modules/prisma/build/index.js db push --skip-generate --schema=./prisma/schema.prisma
exec node server.js
