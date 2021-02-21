FROM bbyars/mountebank:latest

ENV MB_GRAPHQL_VERSION=0.0.1
RUN npm install -g mb-graphql@${MB_GRAPHQL_VERSION} --production

RUN mkdir /mb-graphql
COPY protocols.json /mb-graphql

WORKDIR /mb-graphql

EXPOSE 2525

ENTRYPOINT ["mb"]
CMD ["start", "--protofile", "protocols.json"]
