#!/usr/bin/env bash
set -euo pipefail

for no in {1..10}; do

    # if no is odd, print "## no"
    if [ $((no % 2)) -eq 1 ]; then
        echo "### $no"
    else
        echo $no
    fi
    sleep 0.3;
done