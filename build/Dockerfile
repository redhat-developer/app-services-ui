#
# Copyright RedHat.
# License: MIT License see the file LICENSE
#
FROM quay.io/app-sre/ubi8-nodejs-12:latest as builder


COPY --chown=default:root / .

# install all deps, and build client/server
RUN npm ci \
  && npm run build

# ---------------------------------------------------------------------------- #

FROM quay.io/app-sre/ubi8-nginx-118

RUN mkdir -p /opt/app-root/src
WORKDIR /opt/app-root/src

COPY --from=builder --chown=root:root /opt/app-root/src/LICENSE ./
COPY --from=builder --chown=root:root /opt/app-root/src/dist ./dist

COPY --chown=root:root build/nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080
