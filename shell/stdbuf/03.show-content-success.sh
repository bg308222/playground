#!/usr/bin/env bash
set -euo pipefail

log_file=${0/%.sh/.txt}

./01.run.sh | tee ${log_file} | stdbuf -oL grep "### " | sed 's/### //'