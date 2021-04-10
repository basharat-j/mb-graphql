FROM alpine:3

ENV NODE_VERSION=14.16.0-r0
ENV MOUNTEBANK_VERSION=2.4.0
ENV MB_GRAPHQL_VERSION=0.1.12

RUN apk update \
 && apk add --no-cache nodejs=${NODE_VERSION} npm=${NODE_VERSION} \
 && npm install -g mountebank@${MOUNTEBANK_VERSION} mb-graphql@${MB_GRAPHQL_VERSION} --production \
 && npm cache clean --force 2>/dev/null \
 && apk del npm \
 && rm -rf /tmp/npm*

COPY protocols.json .

EXPOSE 2525

ENTRYPOINT ["mb"]
CMD ["start", "--protofile", "protocols.json"]
