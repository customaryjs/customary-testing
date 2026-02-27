#!/bin/bash
set -o errexit
set -o pipefail

sed -i 's/%e%e/%e<br\/>%e/' node_modules/mocha/mocha.js
