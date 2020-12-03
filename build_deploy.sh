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
IMAGE_REPOSITORY=${IMAGE_REPOSITORY:-"quay.io/app-sre/mk-ui-host"}
IMAGE_TAG=${IMAGE_TAG:-${VERSION}}
IMAGE="${IMAGE_REPOSITORY}:${IMAGE_TAG}"

# Log in to the image registry:
if [ -z "${QUAY_USER}" ]; then
    echo "The quay.io push user name hasn't been provided."
    echo "Make sure to set the QUAY_USER environment variable."
    exit 1
fi
if [ -z "${QUAY_TOKEN}" ]; then
    echo "The quay.io push token hasn't been provided."
    echo "Make sure to set the QUAY_TOKEN environment variable."
    exit 1
fi

step "Build the image"
${CONTAINER_ENGINE} build -t ${IMAGE} -f ./build/dockerfile .

step "Login to quay.io"
${CONTAINER_ENGINE} login -u ${QUAY_USER} -p ${QUAY_TOKEN} quay.io

step "Push the image"
${CONTAINER_ENGINE} push ${IMAGE}

step "Push the client files"
CID=$(${CONTAINER_ENGINE} create ${IMAGE})
${CONTAINER_ENGINE} cp ${CID}:/opt/app-root/src/dist .
${CONTAINER_ENGINE} rm ${CID}

./hack/push_to_insights.sh \
    --nachobot-token "${NACHOBOT_TOKEN}" \
    --version "${VERSION}" \
    --branch ci-beta \
    --author-name Bot \
    --author-email ms-devexp@redhat.com
