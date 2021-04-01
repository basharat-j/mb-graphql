Feature: Query imposter created from GraphQL schema endpoint
  Allow querying of GraphQL imposter having a remote schema definition

  Scenario: Query imposter with endpoint with accessible introspection query
    Given a GraphQL server exists at "http://localhost:3000" with the following schema definition:
    """
    type Thing {
      alpha: Int
      beta: String
    }

    input ThingInput {
      alpha: Int!
      beta: String!
    }

    type Query {
      dummyQuery: String
    }

    type Mutation {
      myMutation(data: ThingInput!): Thing
    }
    """
    And a GraphQL imposter exists on port 4000 configured with the "http://localhost:3000" schema endpoint
    And the imposter's single stub has the following predicates:
    """
    [
      {
        "equals": {
          "mutation": "myMutation",
          "args": {
            "data": {
              "alpha": 42,
              "beta": "abcdef"
            }
          }
        }
      }
    ]
    """
    And the imposter's single stub has the following responses:
    """
    [
      {
        "is": {
          "data": {
            "alpha": 24,
            "beta": "fedcba"
          }
        }
      }
    ]
    """
    When Brandon attempts to execute the following GraphQL query:
    """
    mutation {
      myMutation(data: {
        alpha: 42
        beta: "abcdef"
      }) {
        beta
        alpha
      }
    }
    """
    Then the query will be successful and the response will be:
    """
    {
      "data": {
        "myMutation": {
          "beta": "fedcba",
          "alpha": 24
        }
      }
    }
    """

  Scenario: Query imposter with endpoint with accessible introspection query requiring authentication
    Given a secure GraphQL server requiring the "my.access.token" bearer token exists at "http://localhost:3001" with the following schema definition:
    """
    type Thing {
      alpha: Int
      beta: String
    }

    input ThingInput {
      alpha: Int!
      beta: String!
    }

    type Query {
      dummyQuery: String
    }

    type Mutation {
      mySecureMutation(data: ThingInput!): Thing
    }
    """
    And a GraphQL imposter exists on port 4000 configured with the "http://localhost:3001" schema endpoint and the following schema endpoint headers:
      | Authorization | Bearer my.access.token |
    And the imposter's single stub has the following predicates:
    """
    [
      {
        "equals": {
          "mutation": "mySecureMutation",
          "args": {
            "data": {
              "alpha": 42,
              "beta": "abcdef"
            }
          }
        }
      }
    ]
    """
    And the imposter's single stub has the following responses:
    """
    [
      {
        "is": {
          "data": {
            "alpha": 24,
            "beta": "fedcba"
          }
        }
      }
    ]
    """
    When Ivan attempts to execute the following GraphQL query:
    """
    mutation {
      mySecureMutation(data: {
        alpha: 42
        beta: "abcdef"
      }) {
        beta
        alpha
      }
    }
    """
    Then the query will be successful and the response will be:
    """
    {
      "data": {
        "mySecureMutation": {
          "beta": "fedcba",
          "alpha": 24
        }
      }
    }
    """

  Scenario: Query non-executable schema imposter with endpoint having accessible introspection query
    Given a GraphQL server exists at "http://localhost:3000" with the following schema definition:
    """
    type Thing {
      alpha: Int
      beta: String
    }

    input ThingInput {
      alpha: Int!
      beta: String!
    }

    type Query {
      dummyQuery: String
    }

    type Mutation {
      myMutation(data: ThingInput!): Thing
    }
    """
    And a GraphQL imposter exists on port 4000 configured with the "http://localhost:3000" schema endpoint
    When Lee attempts to execute the following GraphQL query:
    """
    mutation {
      myMutation(data: {
        alpha: 42
        beta: "abcdef"
      }) {
        beta
        alpha
      }
    }
    """
    Then the query will be successful and the response will match:
      | JSON Path             | Value Type | Value |
      | data.myMutation.alpha | Int        |       |
      | data.myMutation.beta  | String     |       |
    And the GraphQL server at "http://localhost:3000" will have not received any requests

  Scenario: Query imposter with remotely hosted schema definition
    Given a following schema definition exists at the "http://localhost:8080/schema.graphql" URL:
    """
    type OtherThing {
      alpha: Int
      beta: String
    }

    input OtherThingInput {
      alpha: Int!
      beta: String!
    }

    type Query {
      dummyQuery: String
    }

    type Mutation {
      myOtherMutation(data: OtherThingInput!): OtherThing
    }
    """
    And a GraphQL imposter exists on port 4000 configured with the "http://localhost:8080/schema.graphql" schema endpoint
    And the imposter's single stub has the following predicates:
    """
    [
      {
        "equals": {
          "mutation": "myOtherMutation",
          "args": {
            "data": {
              "alpha": 123,
              "beta": "abc"
            }
          }
        }
      }
    ]
    """
    And the imposter's single stub has the following responses:
    """
    [
      {
        "is": {
          "data": {
            "alpha": 456,
            "beta": "def"
          }
        }
      }
    ]
    """
    When Uri attempts to execute the following GraphQL query:
    """
    mutation {
      myOtherMutation(data: {
        alpha: 123
        beta: "abc"
      }) {
        beta
        alpha
      }
    }
    """
    Then the query will be successful and the response will be:
    """
    {
      "data": {
        "myOtherMutation": {
          "beta": "def",
          "alpha": 456
        }
      }
    }
    """
