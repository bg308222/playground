#!/usr/bin/env bash
set -euo pipefail

while true; do
    for no in {1..9}; do
        echo -n "$no"
        sleep 0.3;
    done
done