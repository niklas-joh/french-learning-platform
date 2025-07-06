#!/bin/bash
set -e
GREEN="\033[0;32m"
NC="\033[0m"

echo -e "${GREEN}Starting full documentation generation...${NC}"

npm run docs:setup
npm run docs:schema
npm run docs:migrations
npm run docs:code-analysis
npm run docs:dependencies
npm run docs:api
npm run docs:structure
npm run docs:dev-guide
npm run docs:patterns

echo -e "${GREEN}Documentation generation completed.${NC}"
