#
# Copyright RedHat.
# License: MIT License see the file LICENSE
#
FROM quay.io/app-sre/ubi8-nodejs-14:latest as builder


COPY --chown=default:root / .

# install all deps, and build client/server
RUN npm ci -q \
  && npm run build
# clear deps, and only install prod deps - needed as server build does not bundle them/node provided functions
RUN rm -rf /node_modules \
  && npm ci -q --only=production \
  && npm dedupe

# ---------------------------------------------------------------------------- #

FROM quay.io/app-sre/ubi8-nginx-118

RUN mkdir -p /opt/app-root/src
WORKDIR /opt/app-root/src

COPY --from=builder --chown=root:root /opt/app-root/src/LICENSE ./
COPY --from=builder --chown=root:root /opt/app-root/src/dist ./dist

COPY --chown=root:root build/nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080
