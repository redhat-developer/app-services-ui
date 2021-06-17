#
# Copyright RedHat.
# License: MIT License see the file LICENSE
#

ARG NGINX_REGISTRY=docker.io

FROM quay.io/app-sre/ubi8-nodejs-12:latest as builder


COPY --chown=default:root / .

# install all deps, and build client/server
RUN npm install -q \
  && npm run build
# clear deps, and only install prod deps - needed as server build does not bundle them/node provided functions
RUN rm -rf /node_modules \
  && npm install -q --only=production \
  && npm dedupe

# ---------------------------------------------------------------------------- #

ARG NGINX_REGISTRY=docker.io
FROM ${NGINX_REGISTRY}/nginx:1.21-alpine

RUN mkdir -p /opt/app-root/src
WORKDIR /opt/app-root/src

COPY --from=builder --chown=root:root /opt/app-root/src/LICENSE ./
COPY --from=builder --chown=root:root /opt/app-root/src/dist ./dist

COPY --chown=root:root build/nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080
