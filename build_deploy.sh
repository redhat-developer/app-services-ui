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
    echo "error: the build_deploy.sh script must be executed from the project root"
    exit 1
fi

CONTAINER_ENGINE=${CONTAINER_ENGINE:-"docker"}
VERSION="$(git log --pretty=format:'%h' -n 1)"
IMAGE_REPOSITORY=${IMAGE_REPOSITORY:-"mk-ui-host"}
IMAGE_TAG=${IMAGE_TAG:-${VERSION}}
IMAGE="${IMAGE_REPOSITORY}:${IMAGE_TAG}"

step "Build the image"
${CONTAINER_ENGINE} build -t ${IMAGE} -f ./build/Dockerfile .

step "Push the client files"
CID=$(${CONTAINER_ENGINE} create ${IMAGE})
${CONTAINER_ENGINE} cp ${CID}:/opt/app-root/src/dist .
${CONTAINER_ENGINE} rm ${CID}

./hack/push_to_insights.sh \
    --nachobot-token "${NACHOBOT_TOKEN}" \
    --version "${VERSION}" \
    --branch qa-beta \
    --author-name Bot \
    --author-email ms-devexp@redhat.com
