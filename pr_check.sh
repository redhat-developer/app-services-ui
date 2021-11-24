#!/usr/bin/env bash
#
# Copyright RedHat.
# License: MIT License see the file LICENSE

# Inspired by https://disconnected.systems/blog/another-bash-strict-mode/
set -eEu -o pipefail
trap 's=$?; echo "[ERROR] [$(date +"%T")] on $0:$LINENO"; exit $s' ERR

function log() {
    echo "[$1] [$(date +"%T")] - ${2}"
}

function step() {
    log "STEP" "$1"
}

if [[ ! -d ./.git ]]; then
    echo "error: the pr_check.sh script must be executed from the project root"
    exit 1
fi

CONTAINER_ENGINE=${CONTAINER_ENGINE:-"docker"}
TOOLS_IMAGE=${TOOLS_IMAGE:-"quay.io/app-sre/mk-ci-tools:latest"}
TOOLS_HOME=$(mktemp -d)

function run() {
    ${CONTAINER_ENGINE} run \
        -u ${UID} \
        -v ${TOOLS_HOME}:/thome:z \
        -e HOME=/thome \
        -v ${PWD}:/workspace:z \
        -w /workspace \
        ${TOOLS_IMAGE} \
        $@
}

step "Pull tools image"
${CONTAINER_ENGINE} pull ${TOOLS_IMAGE}

step "Test image build"
docker build \
    -t mk-ui-host:latest \
    -f ./build/Dockerfile .
