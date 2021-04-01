Feature: Query imposter
  Allow querying of GraphQL imposter

  Background:
    Given a GraphQL imposter exists on port 4000 with the following inline schema definition:
    """
    type Thing {
      alpha: Int
      beta: String
      otherThing(mySecondArg: Int): Thing
    }

    type Query {
      myQuery(myFirstArg: Int): Thing
    }
    """

  Scenario: Query imposter with predicate matching top-level query
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

  Scenario: Query imposter with predicate match returning part of query
    And the imposter's single stub has the following predicates:
    """
    [
      {
        "equals": {
          "query": "myQuery"
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
    When Lee attempts to execute the following GraphQL query:
    """
    query {
      myQuery(myFirstArg: 123) {
        alpha
        beta
        otherThing(mySecondArg: 456) {
          alpha
          beta
        }
      }
    }
    """
    Then the query will be successful and the response will match:
      | JSON Path                     | Value Type | Value  |
      | data.myQuery.alpha            | Int        | 42     |
      | data.myQuery.beta             | String     | abcdef |
      | data.myQuery.otherThing.alpha | Int        |        |
      | data.myQuery.otherThing.beta  | String     |        |
