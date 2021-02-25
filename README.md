# Welcome, friend

mb-graphql is a [mountebank](https://www.mbtest.org) plugin that makes creating test doubles for GraphQL APIs a lot
simpler... and fun.

Wraps [Apollo Server](https://www.apollographql.com/docs/apollo-server) to allow easy declaration of a mock GraphQL
server via mountebank `stubs` (see below).

## Run with Docker (the easiest option)
```
docker run -p 2525:2525 [-p IMPOSTER_PORT:IMPOSTER_PORT] -d bashj79/mountebank-graphql
```
NOTE: mountebank itself runs on port 2525.

Check out [Docker Hub](https://hub.docker.com/r/bashj79/mountebank-graphql) for further details.

## Install and Run

Prerequisite:

* [mountebank](https://www.mbtest.org)

```
npm install -g mb-graphql
```

Start mountebank with the following `protocols.json` file ([master on GitHub](https://github.com/bashj79/mb-graphql/blob/master/protocols.json)):

```json
{
  "graphql": {
    "createCommand": "mb-graphql"
  }
}
```

```
mb start --protofile protocols.json
```

## Example

`imposter.json`

```json
{
  "port": 4000,
  "protocol": "graphql",
  "schema": "type Thing { alpha: Int beta: String } type Query { myQuery(myFirstArg: Int, mySecondArg: Int): Thing }",
  "stubs": [
    {
      "predicates": [
        {
          "equals": {
            "query": "myQuery"
          }
        },
        {
          "equals": {
            "args": {
              "myFirstArg": 123
            }
          }
        }
      ],
      "responses": [
        {
          "is": {
            "data": {
              "beta": "abcdef"
            }
          }
        }
      ]
    }
  ]
}
```

Create the imposter via mountebank (assuming it's running on `localhost:2525`):

```
curl -i -X POST -H 'Content-Type: application/json' http://localhost:2525/imposters --data @imposter.json
```

### Request

```graphql
query {
    myQuery(myFirstArg: 123, mySecondArg: 456) {
        alpha
        beta
    }
}
```

### Response

```json
{
  "data": {
    "myQuery": {
      "alpha": 42,
      "beta": "abcdef"
    }
  }
}
```

Note: The value for `myQuery.alpha` has been randomly generated as it was omitted from the stub's response.

## Imposter Creation Parameters

For further information about mountebank imposters, stubs and related concepts please refer to
the [mountbank mental model](https://www.mbtest.org/docs/mentalModel).

| Parameter               | Description                                                                                                             | Required?                      | Default                                                                                      |
|-------------------------|-------------------------------------------------------------------------------------------------------------------------|--------------------------------|----------------------------------------------------------------------------------------------|
| `protocol`              | Must be set to `graphql`                                                                                                | Yes                            | N/A                                                                                          |                                                                                     
| `defaultResponse`       | Important: Do not set as it will interfere with GraphQL resolution.                                                     | No. Do not set.                | Default behaviour for the imposter is to return random data according to the defined schema. |
| `port`                  | The port to run the imposter on.                                                                                        | No                             | A randomly assigned port. mountebank will return the actual value in the `POST` response.    |                                                                                     
| `name`                  | Included in the logs, useful when multiple imposters are set up.                                                        | No                             | An empty string.                                                                             |
| `schema`                | A string presenting a valid GraphQL schema definition.                                                                  | No, if `schemaEndpoint` is set | N/A                                                                                          |      
| `schemaEndpoint`        | The endpoint of an existing GraphQL API which exposes the GraphQL introspection query.                                  | No, if `schema` is set         | N/A                                                                                          |  
| `schemaEndpointHeaders` | An object representing headers to passed on to the GraphQL API defined in `schemaEndpoint` e.g. `Authorization` header. | No                             | An empty object.                                                                             |
| `stubs`                 | The list of stubs responsible for matching a GraphQL request and returning a response. See further details below.       | No                             | An empty array.                                                                              |

## GraphQL Requests

| Field      | Description                                                                                           | Type   |
|------------|-------------------------------------------------------------------------------------------------------|--------|
| `query`    | The name of the GraphQL query e.g. `myQuery` or sub-query e.g. `myQuery.mySubQuery.mySecondSubQuery`. | String |
| `mutation` | The name of the GraphQL mutation e.g. `myMutation`.                                                   | String |
| `args`     | The arguments passed to the GraphQL query/mutation.                                                   | Object |
| `headers`  | The HTTP headers passed to the GraphQL query/mutation.                                                | Object |

Please see the [mountebank predicate documentation](https://www.mbtest.org/docs/api/predicates) for further details of
mountebank's stub predicates and their usage.
