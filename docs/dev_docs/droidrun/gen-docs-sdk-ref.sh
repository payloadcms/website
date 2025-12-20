#!/bin/bash

# Generate documentation for the SDK reference

pydoc-markdown

# rename .md to .mdx
# Rename all .md files to .mdx in the docs/v3/sdk directory
find docs/v4/sdk -name "*.md" -exec sh -c 'mv "$1" "${1%.md}.mdx"' _ {} \;

# update docs/v3/.generated-files.txt with the new files extension
# Set sed in-place flag for macOS and Linux compatibility
if [[ "$(uname)" == "Darwin" ]]; then
  SED_INPLACE=(-i '')
else
  SED_INPLACE=(-i)
fi

sed "${SED_INPLACE[@]}" 's/\.md/.mdx/g' docs/.generated-files.txt
