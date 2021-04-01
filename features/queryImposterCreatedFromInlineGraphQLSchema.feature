Feature: Query imposter created from inline GraphQL schema
  Allow querying of GraphQL imposter having an inline schema definition

  Background:
    Given a GraphQL imposter exists on port 4000 with the following inline schema definition:
    """
    type Thing {
      alpha: Int
      beta: String
    }

    type Query {
      myQuery(myFirstArg: Int, mySecondArg: Int): Thing
    }
    """
    And the imposter's single stub has the following predicates:
    """
    [
      {
        "equals": {
          "query": "myQuery",
          "args": {
            "myFirstArg": 123
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
            "alpha": 42,
            "beta": "abcdef"
          }
        }
      }
    ]
    """

  Scenario: Query imposter with exact predicate match
    When Brandon attempts to execute the following GraphQL query:
    """
    query {
      myQuery(myFirstArg: 123) {
        alpha
        beta
      }
    }
    """
    Then the query will be successful and the response will be:
    """
    {
      "data": {
        "myQuery": {
          "alpha": 42,
          "beta": "abcdef"
        }
      }
    }
    """

  Scenario: Query imposter with partial predicate match
    When Ivan attempts to execute the following GraphQL query:
    """
    query {
      myQuery(myFirstArg: 456) {
        alpha
        beta
      }
    }
    """
    Then the query will be successful and the response will match:
      | JSON Path          | Value Type |
      | data.myQuery.alpha | Int        |
      | data.myQuery.beta  | String     |
