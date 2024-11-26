#!/usr/bin/env bash
rm -Rf public
# npx quartz build --serve --port 1231 --verbose 
npx quartz build --serve --port 1231 --concurrency 4

