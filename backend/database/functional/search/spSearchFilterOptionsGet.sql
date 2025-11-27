/**
 * @summary
 * Retrieves available filter options dynamically from the product catalog
 * with progressive refinement based on currently applied filters.
 *
 * @procedure spSearchFilterOptionsGet
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/search/filter-options
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy isolation
 *
 * @param {NVARCHAR(MAX)} categories
 *   - Required: No
 *   - Description: JSON array of currently selected categories
 *
 * @param {NUMERIC(18,6)} priceMin
 *   - Required: No
 *   - Description: Currently selected minimum price
 *
 * @param {NUMERIC(18,6)} priceMax
 *   - Required: No
 *   - Description: Currently selected maximum price
 *
 * @param {NVARCHAR(MAX)} materials
 *   - Required: No
 *   - Description: JSON array of currently selected materials
 *
 * @param {NVARCHAR(MAX)} colors
 *   - Required: No
 *   - Description: JSON array of currently selected colors
 *
 * @param {NVARCHAR(MAX)} styles
 *   - Required: No
 *   - Description: JSON array of currently selected styles
 *
 * @testScenarios
 * - Valid filter options retrieval without current filters
 * - Filter options with progressive refinement
 * - Empty catalog handling
 * - Invalid account validation
 */
CREATE OR ALTER PROCEDURE [functional].[spSearchFilterOptionsGet]
  @idAccount INTEGER,
  @categories NVARCHAR(MAX) = NULL,
  @priceMin NUMERIC(18, 6) = NULL,
  @priceMax NUMERIC(18, 6) = NULL,
  @materials NVARCHAR(MAX) = NULL,
  @colors NVARCHAR(MAX) = NULL,
  @styles NVARCHAR(MAX) = NULL
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
   * @rule {fn-progressive-refinement} Apply current filters to refine available options
   */
  WITH [FilteredProducts] AS (
    SELECT
      [prdSrchIdx].[idProduct],
      [prdSrchIdx].[category],
      [prdSrchIdx].[material],
      [prdSrchIdx].[color],
      [prdSrchIdx].[style],
      [prdSrchIdx].[price],
      [prdSrchIdx].[height],
      [prdSrchIdx].[width],
      [prdSrchIdx].[depth]
    FROM [functional].[productSearchIndex] [prdSrchIdx]
    WHERE [prdSrchIdx].[idAccount] = @idAccount
      AND [prdSrchIdx].[deleted] = 0
      AND (
        @categories IS NULL
        OR [prdSrchIdx].[category] IN (SELECT [value] FROM OPENJSON(@categories))
      )
      AND (
        @priceMin IS NULL
        OR [prdSrchIdx].[price] >= @priceMin
      )
      AND (
        @priceMax IS NULL
        OR [prdSrchIdx].[price] <= @priceMax
      )
      AND (
        @materials IS NULL
        OR [prdSrchIdx].[material] IN (SELECT [value] FROM OPENJSON(@materials))
      )
      AND (
        @colors IS NULL
        OR [prdSrchIdx].[color] IN (SELECT [value] FROM OPENJSON(@colors))
      )
      AND (
        @styles IS NULL
        OR [prdSrchIdx].[style] IN (SELECT [value] FROM OPENJSON(@styles))
      )
  )
  /**
   * @output {Categories, n, 1}
   * @column {NVARCHAR} category - Available category name
   */
  SELECT DISTINCT [fltPrd].[category]
  FROM [FilteredProducts] [fltPrd]
  WHERE [fltPrd].[category] IS NOT NULL
  ORDER BY [fltPrd].[category];

  /**
   * @output {Materials, n, 1}
   * @column {NVARCHAR} material - Available material name
   */
  SELECT DISTINCT [fltPrd].[material]
  FROM [FilteredProducts] [fltPrd]
  WHERE [fltPrd].[material] IS NOT NULL
  ORDER BY [fltPrd].[material];

  /**
   * @output {Colors, n, 1}
   * @column {NVARCHAR} color - Available color name
   */
  SELECT DISTINCT [fltPrd].[color]
  FROM [FilteredProducts] [fltPrd]
  WHERE [fltPrd].[color] IS NOT NULL
  ORDER BY [fltPrd].[color];

  /**
   * @output {Styles, n, 1}
   * @column {NVARCHAR} style - Available style name
   */
  SELECT DISTINCT [fltPrd].[style]
  FROM [FilteredProducts] [fltPrd]
  WHERE [fltPrd].[style] IS NOT NULL
  ORDER BY [fltPrd].[style];

  /**
   * @output {PriceRange, 1, 1}
   * @column {NUMERIC} minPrice - Minimum product price
   * @column {NUMERIC} maxPrice - Maximum product price
   */
  SELECT
    MIN([fltPrd].[price]) AS [minPrice],
    MAX([fltPrd].[price]) AS [maxPrice]
  FROM [FilteredProducts] [fltPrd];

  /**
   * @output {DimensionRanges, 1, 1}
   * @column {NUMERIC} minHeight - Minimum product height
   * @column {NUMERIC} maxHeight - Maximum product height
   * @column {NUMERIC} minWidth - Minimum product width
   * @column {NUMERIC} maxWidth - Maximum product width
   * @column {NUMERIC} minDepth - Minimum product depth
   * @column {NUMERIC} maxDepth - Maximum product depth
   */
  SELECT
    MIN([fltPrd].[height]) AS [minHeight],
    MAX([fltPrd].[height]) AS [maxHeight],
    MIN([fltPrd].[width]) AS [minWidth],
    MAX([fltPrd].[width]) AS [maxWidth],
    MIN([fltPrd].[depth]) AS [minDepth],
    MAX([fltPrd].[depth]) AS [maxDepth]
  FROM [FilteredProducts] [fltPrd];
END;
GO
