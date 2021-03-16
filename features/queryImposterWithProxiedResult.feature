Feature: Create imposter with proxied result
  Allow querying of GraphQL imposter which uses a proxied result

  Background:
    Given a GraphQL server exists at "http://localhost:3000" which returns the following result for the "myQuery" query:
    """
    {
      "data": {
        "myQuery": {
          "alpha": 123,
          "beta": "abcdef"
        }
      }
    }
    """
    And a GraphQL imposter exists on port 4000 with the following inline schema definition:
    """
    type Thing {
      alpha: Int
      beta: String
    }

    type Query {
      myQuery(myFirstArg: Int, mySecondArg: Int): Thing
    }
    """


  Scenario: Query imposter with exact predicate match
    Given the imposter's single stub has the following predicates:
    """
    [
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
    ]
    """
    And the imposter's single stub has the following responses:
    """
    [
      {
        "proxy": {
          "to": "http://localhost:3000"
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
          "alpha": 123,
          "beta": "abcdef"
        }
      }
    }
    """
