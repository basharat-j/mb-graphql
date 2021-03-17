Feature: Record requests for imposter
  Allow recording of requests for a given imposter

  Scenario: Record single request for proxy imposter
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
      myQuery(myFirstArg: Int!): Thing
    }

    type Mutation {
      myMutation(data: ThingInput!): Thing
    }
    """
    And a GraphQL imposter exists on port 4000 configured with the "http://localhost:3000" schema endpoint with request recording enabled
    When Brandon attempts to execute the following GraphQL query:
    """
    query {
      myQuery(myFirstArg: 123) {
        alpha
        beta
      }
    }
    """
    And the following requests will be saved for the imposter:
      | Operation | Operation Name | Arguments             | Headers                                |
      | Query     | myQuery        | { "myFirstArg": 123 } | { "content-type": "application/json" } |

  Scenario: Record multiple requests for proxy imposter
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
      myQuery(myFirstArg: Int!): Thing
    }

    type Mutation {
      myMutation(data: ThingInput!): Thing
    }
    """
    And a GraphQL imposter exists on port 4000 configured with the "http://localhost:3000" schema endpoint with request recording enabled
    When Brandon attempts to execute the following GraphQL operations:
    """
    # Operation 1
    query {
      myQuery(myFirstArg: 123) {
        alpha
        beta
      }
    }

    # Operation 2
    mutation {
      myMutation(data: {
        alpha: 456
        beta: "def"
      }) {
        alpha
        beta
      }
    }
    """
    And the following requests will be saved for the imposter:
      | Operation | Operation Name | Arguments                                   | Headers                                |
      | Query     | myQuery        | { "myFirstArg": 123 }                       | { "content-type": "application/json" } |
      | Mutation  | myMutation     | { "data": { "alpha": 456, "beta": "def" } } | { "content-type": "application/json" } |
