FROM node:24-alpine

ARG BUILD_VERSION
ARG BUILD_ARCH

LABEL \
  io.hass.version="${BUILD_VERSION}" \
  io.hass.type="app" \
  io.hass.arch="${BUILD_ARCH}"

RUN apk add --no-cache nginx bash

WORKDIR /app

ADD https://github.com/bilawalsidhu/gods-eye-view/archive/refs/heads/main.tar.gz /tmp/gods-eye-view.tar.gz
RUN tar -xzf /tmp/gods-eye-view.tar.gz --strip-components=1 -C /app \
    && rm /tmp/gods-eye-view.tar.gz \
    && sed -i "/server: {/i\\      base: './'," build/vite.js \
    && sed -i 's#href="/#href="./#g; s#src="/#src="./#g' index.html src/**/*.html 2>/dev/null || true \
    && find src -type f \( -name '*.js' -o -name '*.html' \) -print0 | xargs -0 sed -i "s#'/api/#'./api/#g; s#\"/api/#\"./api/#g; s#\`/api/#\`./api/#g" \
    && npm ci

COPY nginx.conf /etc/nginx/http.d/default.conf
COPY run.sh /run.sh
RUN chmod +x /run.sh

EXPOSE 8099

CMD ["/run.sh"]
