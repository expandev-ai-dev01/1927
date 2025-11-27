/**
 * @summary
 * Provides autocomplete suggestions based on partial search term input.
 * Returns product names, categories, and popular search terms with synonym expansion.
 *
 * @procedure spSearchAutocomplete
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/external/public/search/autocomplete
 *
 * @parameters
 * @param {NVARCHAR(100)} searchTerm
 *   - Required: Yes
 *   - Description: Partial search term (minimum 2 characters)
 *
 * @param {INT} maxSuggestions
 *   - Required: No
 *   - Description: Maximum number of suggestions to return (default 10)
 *
 * @testScenarios
 * - Valid autocomplete with 2 characters
 * - Autocomplete with synonym expansion
 * - Autocomplete with no matches
 * - Autocomplete with special characters
 */
CREATE OR ALTER PROCEDURE [functional].[spSearchAutocomplete]
  @searchTerm NVARCHAR(100),
  @maxSuggestions INT = 10
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Validate search term length
   * @throw {searchTermTooShort}
   */
  IF (LEN(@searchTerm) < 2)
  BEGIN
    ;THROW 51000, 'searchTermTooShort', 1;
  END;

  /**
   * @rule {fn-autocomplete-synonym-expansion} Include synonyms in autocomplete suggestions
   */
  DECLARE @expandedTerms TABLE (
    [term] NVARCHAR(100)
  );

  INSERT INTO @expandedTerms ([term])
  SELECT DISTINCT @searchTerm
  UNION
  SELECT DISTINCT [synm].[synonym]
  FROM [functional].[searchSynonym] [synm]
  WHERE [synm].[term] LIKE LOWER(@searchTerm) + '%'
    OR [synm].[synonym] LIKE @searchTerm + '%';

  /**
   * @output {AutocompleteSuggestions, n, n}
   * @column {NVARCHAR} suggestion - Suggested search term
   * @column {NVARCHAR} type - Type of suggestion (product, category, term)
   * @column {INT} relevance - Relevance score for ordering
   */
  SELECT TOP (@maxSuggestions)
    [suggestion],
    [type],
    [relevance]
  FROM (
    SELECT DISTINCT
      [prdSrchIdx].[name] AS [suggestion],
      'product' AS [type],
      CASE
        WHEN [prdSrchIdx].[name] LIKE @searchTerm + '%' THEN 100
        WHEN [prdSrchIdx].[name] LIKE '%' + @searchTerm + '%' THEN 90
        ELSE 80
      END AS [relevance]
    FROM [functional].[productSearchIndex] [prdSrchIdx]
    WHERE [prdSrchIdx].[deleted] = 0
      AND (
        [prdSrchIdx].[name] LIKE @searchTerm + '%'
        OR [prdSrchIdx].[name] LIKE '%' + @searchTerm + '%'
        OR EXISTS (SELECT 1 FROM @expandedTerms [expTrm] WHERE [prdSrchIdx].[name] LIKE '%' + [expTrm].[term] + '%')
      )

    UNION

    SELECT DISTINCT
      [prdSrchIdx].[category] AS [suggestion],
      'category' AS [type],
      70 AS [relevance]
    FROM [functional].[productSearchIndex] [prdSrchIdx]
    WHERE [prdSrchIdx].[deleted] = 0
      AND [prdSrchIdx].[category] IS NOT NULL
      AND (
        [prdSrchIdx].[category] LIKE @searchTerm + '%'
        OR [prdSrchIdx].[category] LIKE '%' + @searchTerm + '%'
      )

    UNION

    SELECT DISTINCT TOP 3
      [srchHst].[searchTerm] AS [suggestion],
      'popular' AS [type],
      60 AS [relevance]
    FROM [functional].[searchHistory] [srchHst]
    WHERE [srchHst].[searchTerm] LIKE @searchTerm + '%'
      AND [srchHst].[resultCount] > 0
    GROUP BY [srchHst].[searchTerm]
    ORDER BY COUNT(*) DESC
  ) AS [suggestions]
  ORDER BY [relevance] DESC, [suggestion] ASC;
END;
GO