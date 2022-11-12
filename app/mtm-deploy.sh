#!/bin/bash
npm run build:release-prod && git checkout develop-free && npm run build:release-free