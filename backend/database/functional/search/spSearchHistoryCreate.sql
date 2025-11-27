/**
 * @summary
 * Records a search operation in the search history for analytics and personalization.
 *
 * @procedure spSearchHistoryCreate
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - POST /api/v1/internal/search/history
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy isolation
 *
 * @param {NVARCHAR(100)} searchTerm
 *   - Required: Yes
 *   - Description: Search term used by the user
 *
 * @param {NVARCHAR(MAX)} filters
 *   - Required: No
 *   - Description: JSON string containing applied filters
 *
 * @param {INT} resultCount
 *   - Required: Yes
 *   - Description: Number of results returned by the search
 *
 * @returns {INT} idSearchHistory - Created search history record identifier
 *
 * @testScenarios
 * - Valid search history creation
 * - Search history with filters
 * - Search history without filters
 * - Invalid parameters validation
 */
CREATE OR ALTER PROCEDURE [functional].[spSearchHistoryCreate]
  @idAccount INTEGER,
  @searchTerm NVARCHAR(100),
  @filters NVARCHAR(MAX) = NULL,
  @resultCount INTEGER
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
   * @validation Validate search term
   * @throw {searchTermRequired}
   */
  IF (@searchTerm IS NULL OR LEN(@searchTerm) < 2)
  BEGIN
    ;THROW 51000, 'searchTermRequired', 1;
  END;

  /**
   * @validation Validate result count
   * @throw {resultCountRequired}
   */
  IF (@resultCount IS NULL OR @resultCount < 0)
  BEGIN
    ;THROW 51000, 'invalidResultCount', 1;
  END;

  BEGIN TRY
    BEGIN TRAN;

    INSERT INTO [functional].[searchHistory]
    ([idAccount], [searchTerm], [filters], [resultCount])
    VALUES
    (@idAccount, @searchTerm, @filters, @resultCount);

    /**
     * @output {SearchHistoryCreated, 1, 1}
     * @column {INT} idSearchHistory - Created search history identifier
     */
    SELECT SCOPE_IDENTITY() AS [idSearchHistory];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO