/**
 * @summary
 * Provides autocomplete suggestions based on partial search term input.
 * Returns product names, categories, and popular search terms that match
 * the input, including synonym expansion for better results.
 *
 * @procedure spSearchSuggestionsGet
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/search/suggestions
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy isolation
 *
 * @param {NVARCHAR(100)} partialTerm
 *   - Required: Yes
 *   - Description: Partial search term (minimum 2 characters)
 *
 * @param {INT} maxSuggestions
 *   - Required: No
 *   - Description: Maximum number of suggestions to return (default 10)
 *
 * @testScenarios
 * - Valid partial term with multiple matches
 * - Partial term with synonym matches
 * - Partial term with no matches
 * - Term too short (less than 2 characters)
 * - Invalid account access
 */
CREATE OR ALTER PROCEDURE [functional].[spSearchSuggestionsGet]
  @idAccount INTEGER,
  @partialTerm NVARCHAR(100),
  @maxSuggestions INTEGER = 10
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Validate required parameters
   * @throw {parameterRequired}
   */
  IF (@idAccount IS NULL)
  BEGIN
    THROW 51000, 'idAccountRequired', 1;
  END;

  IF (@partialTerm IS NULL)
  BEGIN
    THROW 51000, 'partialTermRequired', 1;
  END;

  /**
   * @validation Validate partial term length
   * @throw {partialTermTooShort}
   */
  IF (LEN(@partialTerm) < 2)
  BEGIN
    THROW 51000, 'partialTermTooShort', 1;
  END;

  /**
   * @rule {fn-autocomplete-suggestions} Generate suggestions from products and synonyms
   */
  WITH [ProductSuggestions] AS (
    SELECT DISTINCT TOP (@maxSuggestions)
      [prdSrchIdx].[name] AS [suggestion],
      'product' AS [type],
      100 AS [priority]
    FROM [functional].[productSearchIndex] [prdSrchIdx]
    WHERE [prdSrchIdx].[idAccount] = @idAccount
      AND [prdSrchIdx].[deleted] = 0
      AND [prdSrchIdx].[name] LIKE @partialTerm + '%'
    ORDER BY [prdSrchIdx].[name]
  ),
  [CategorySuggestions] AS (
    SELECT DISTINCT TOP (@maxSuggestions)
      [prdSrchIdx].[category] AS [suggestion],
      'category' AS [type],
      90 AS [priority]
    FROM [functional].[productSearchIndex] [prdSrchIdx]
    WHERE [prdSrchIdx].[idAccount] = @idAccount
      AND [prdSrchIdx].[deleted] = 0
      AND [prdSrchIdx].[category] IS NOT NULL
      AND [prdSrchIdx].[category] LIKE @partialTerm + '%'
    ORDER BY [prdSrchIdx].[category]
  ),
  [SynonymSuggestions] AS (
    SELECT DISTINCT TOP (@maxSuggestions)
      [synm].[synonym] AS [suggestion],
      'synonym' AS [type],
      80 AS [priority]
    FROM [functional].[searchSynonym] [synm]
    WHERE [synm].[term] LIKE @partialTerm + '%'
       OR [synm].[synonym] LIKE @partialTerm + '%'
  )
  /**
   * @output {SearchSuggestions, n, n}
   * @column {NVARCHAR} suggestion - Suggested search term
   * @column {NVARCHAR} type - Type of suggestion (product, category, synonym)
   * @column {INT} priority - Priority for ordering suggestions
   */
  SELECT TOP (@maxSuggestions)
    [suggestion],
    [type],
    [priority]
  FROM (
    SELECT * FROM [ProductSuggestions]
    UNION ALL
    SELECT * FROM [CategorySuggestions]
    UNION ALL
    SELECT * FROM [SynonymSuggestions]
  ) [allSugg]
  ORDER BY [priority] DESC, [suggestion];
END;
GO