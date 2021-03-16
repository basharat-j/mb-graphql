FROM bbyars/mountebank:2.4.0

ENV MB_GRAPHQL_VERSION=0.1.7
RUN npm install -g mb-graphql@${MB_GRAPHQL_VERSION} --production

RUN mkdir /mb-graphql
COPY protocols.json /mb-graphql

WORKDIR /app

EXPOSE 2525

ENTRYPOINT ["node", "bin/mb"]
CMD ["start", "--protofile", "/mb-graphql/protocols.json"]
