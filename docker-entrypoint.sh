#!/bin/sh
set -e

mkdir -p /app/data /app/data/uploads
chown -R nextjs:nodejs /app/data

su-exec nextjs node node_modules/prisma/build/index.js db push --skip-generate --schema=./prisma/schema.prisma
exec su-exec nextjs node server.js
