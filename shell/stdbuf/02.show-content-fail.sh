#!/usr/bin/env bash
set -euo pipefail

log_file=${0/%.sh/.txt}

# ./01.run.sh | tee ${log_file}
# ./01.run.sh | tee ${log_file} | grep "### "
./01.run.sh | tee ${log_file} | grep "### " | sed 's/### //'