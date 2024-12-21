#!/bin/bash

# Source the .env file to load variables, ignoring comment lines and empty lines
if [ -f .env ]; then
  # Use awk to filter out comment lines and lines with only whitespace
  export $(awk '!/^[[:space:]]*#/ && NF' .env | xargs)
else
  echo "Error: .env file not found."
  exit 1
fi