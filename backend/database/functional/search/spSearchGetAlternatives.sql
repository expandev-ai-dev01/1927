/**
 * @summary
 * Provides alternative search suggestions and related products when a search
 * returns no results. Uses synonym expansion and category matching.
 *
 * @procedure spSearchGetAlternatives
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/external/public/search/alternatives
 *
 * @parameters
 * @param {NVARCHAR(100)} searchTerm
 *   - Required: Yes
 *   - Description: Original search term that returned no results
 *
 * @param {INT} maxSuggestions
 *   - Required: No
 *   - Description: Maximum number of alternative suggestions (default 5)
 *
 * @param {INT} maxProducts
 *   - Required: No
 *   - Description: Maximum number of related products (default 8)
 *
 * @testScenarios
 * - Get alternatives for term with no results
 * - Get alternatives with synonym matches
 * - Get alternatives with category matches
 */
CREATE OR ALTER PROCEDURE [functional].[spSearchGetAlternatives]
  @searchTerm NVARCHAR(100),
  @maxSuggestions INT = 5,
  @maxProducts INT = 8
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Validate search term
   * @throw {searchTermRequired}
   */
  IF (@searchTerm IS NULL OR LEN(@searchTerm) < 2)
  BEGIN
    ;THROW 51000, 'searchTermRequired', 1;
  END;

  /**
   * @rule {fn-alternative-suggestions} Generate alternative search suggestions based on synonyms and similar terms
   */
  DECLARE @suggestions TABLE (
    [suggestion] NVARCHAR(100),
    [relevance] INT
  );

  INSERT INTO @suggestions ([suggestion], [relevance])
  SELECT DISTINCT TOP (@maxSuggestions)
    [synm].[synonym] AS [suggestion],
    100 AS [relevance]
  FROM [functional].[searchSynonym] [synm]
  WHERE [synm].[term] LIKE '%' + LOWER(@searchTerm) + '%'
    AND EXISTS (
      SELECT 1
      FROM [functional].[productSearchIndex] [prdSrchIdx]
      WHERE [prdSrchIdx].[deleted] = 0
        AND [prdSrchIdx].[searchableText] LIKE '%' + [synm].[synonym] + '%'
    )
  ORDER BY [relevance] DESC;

  IF NOT EXISTS (SELECT 1 FROM @suggestions)
  BEGIN
    INSERT INTO @suggestions ([suggestion], [relevance])
    SELECT DISTINCT TOP (@maxSuggestions)
      [prdSrchIdx].[name] AS [suggestion],
      CASE
        WHEN [prdSrchIdx].[name] LIKE '%' + @searchTerm + '%' THEN 80
        WHEN [prdSrchIdx].[category] LIKE '%' + @searchTerm + '%' THEN 70
        ELSE 60
      END AS [relevance]
    FROM [functional].[productSearchIndex] [prdSrchIdx]
    WHERE [prdSrchIdx].[deleted] = 0
      AND (
        [prdSrchIdx].[name] LIKE '%' + @searchTerm + '%'
        OR [prdSrchIdx].[category] LIKE '%' + @searchTerm + '%'
        OR [prdSrchIdx].[material] LIKE '%' + @searchTerm + '%'
      )
    ORDER BY [relevance] DESC;
  END;

  /**
   * @output {AlternativeSuggestions, n, n}
   * @column {NVARCHAR} suggestion - Alternative search term
   */
  SELECT [suggestion]
  FROM @suggestions
  ORDER BY [relevance] DESC;

  /**
   * @rule {fn-related-products} Select related products based on category and characteristics
   */
  DECLARE @relatedCategory NVARCHAR(100);

  SELECT TOP 1 @relatedCategory = [prdSrchIdx].[category]
  FROM [functional].[productSearchIndex] [prdSrchIdx]
  WHERE [prdSrchIdx].[deleted] = 0
    AND (
      [prdSrchIdx].[name] LIKE '%' + @searchTerm + '%'
      OR [prdSrchIdx].[category] LIKE '%' + @searchTerm + '%'
      OR [prdSrchIdx].[material] LIKE '%' + @searchTerm + '%'
    )
  ORDER BY [prdSrchIdx].[dateCreated] DESC;

  /**
   * @output {RelatedProducts, n, n}
   * @column {INT} idProduct - Product identifier
   * @column {VARCHAR} productCode - Product code
   * @column {NVARCHAR} name - Product name
   * @column {NVARCHAR} category - Product category
   * @column {NUMERIC} price - Product price
   * @column {NVARCHAR} imageUrl - Product image URL
   */
  SELECT TOP (@maxProducts)
    [prdSrchIdx].[idProduct],
    [prdSrchIdx].[productCode],
    [prdSrchIdx].[name],
    [prdSrchIdx].[category],
    [prdSrchIdx].[price],
    [prdSrchIdx].[imageUrl]
  FROM [functional].[productSearchIndex] [prdSrchIdx]
  WHERE [prdSrchIdx].[deleted] = 0
    AND (
      @relatedCategory IS NULL
      OR [prdSrchIdx].[category] = @relatedCategory
    )
  ORDER BY [prdSrchIdx].[dateCreated] DESC;
END;
GO