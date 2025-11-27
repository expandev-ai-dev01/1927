/**
 * @summary
 * Retrieves the recent search history for a specific account.
 * Returns the last N searches ordered by date.
 *
 * @procedure spSearchHistoryList
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/search/history
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy isolation
 *
 * @param {INT} maxResults
 *   - Required: No
 *   - Description: Maximum number of history items to return (default: 10)
 *
 * @testScenarios
 * - Valid history retrieval
 * - History with custom max results
 * - Empty history
 * - Invalid account validation
 */
CREATE OR ALTER PROCEDURE [functional].[spSearchHistoryList]
  @idAccount INTEGER,
  @maxResults INTEGER = 10
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Validate required parameters
   * @throw {accountRequired}
   */
  IF (@idAccount IS NULL)
  BEGIN
    ;THROW 51000, 'accountRequired', 1;
  END;

  /**
   * @output {SearchHistoryList, n, n}
   * @column {INT} idSearchHistory - Search history identifier
   * @column {NVARCHAR} searchTerm - Search term used
   * @column {NVARCHAR} filters - Applied filters (JSON)
   * @column {INT} resultCount - Number of results found
   * @column {DATETIME2} dateCreated - Search execution date
   */
  SELECT TOP (@maxResults)
    [srchHst].[idSearchHistory],
    [srchHst].[searchTerm],
    [srchHst].[filters],
    [srchHst].[resultCount],
    [srchHst].[dateCreated]
  FROM [functional].[searchHistory] [srchHst]
  WHERE [srchHst].[idAccount] = @idAccount
  ORDER BY [srchHst].[dateCreated] DESC;
END;
GO