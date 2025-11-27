/**
 * @summary
 * Retrieves available filter options dynamically from the product catalog.
 * Returns distinct values for categories, materials, colors, styles, and price/dimension ranges.
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
 * @testScenarios
 * - Valid filter options retrieval
 * - Empty catalog handling
 * - Invalid account validation
 */
CREATE OR ALTER PROCEDURE [functional].[spSearchFilterOptionsGet]
  @idAccount INTEGER
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
   * @output {Categories, n, 1}
   * @column {NVARCHAR} category - Available category name
   */
  SELECT DISTINCT [prdSrchIdx].[category]
  FROM [functional].[productSearchIndex] [prdSrchIdx]
  WHERE [prdSrchIdx].[idAccount] = @idAccount
    AND [prdSrchIdx].[deleted] = 0
    AND [prdSrchIdx].[category] IS NOT NULL
  ORDER BY [prdSrchIdx].[category];

  /**
   * @output {Materials, n, 1}
   * @column {NVARCHAR} material - Available material name
   */
  SELECT DISTINCT [prdSrchIdx].[material]
  FROM [functional].[productSearchIndex] [prdSrchIdx]
  WHERE [prdSrchIdx].[idAccount] = @idAccount
    AND [prdSrchIdx].[deleted] = 0
    AND [prdSrchIdx].[material] IS NOT NULL
  ORDER BY [prdSrchIdx].[material];

  /**
   * @output {Colors, n, 1}
   * @column {NVARCHAR} color - Available color name
   */
  SELECT DISTINCT [prdSrchIdx].[color]
  FROM [functional].[productSearchIndex] [prdSrchIdx]
  WHERE [prdSrchIdx].[idAccount] = @idAccount
    AND [prdSrchIdx].[deleted] = 0
    AND [prdSrchIdx].[color] IS NOT NULL
  ORDER BY [prdSrchIdx].[color];

  /**
   * @output {Styles, n, 1}
   * @column {NVARCHAR} style - Available style name
   */
  SELECT DISTINCT [prdSrchIdx].[style]
  FROM [functional].[productSearchIndex] [prdSrchIdx]
  WHERE [prdSrchIdx].[idAccount] = @idAccount
    AND [prdSrchIdx].[deleted] = 0
    AND [prdSrchIdx].[style] IS NOT NULL
  ORDER BY [prdSrchIdx].[style];

  /**
   * @output {PriceRange, 1, 1}
   * @column {NUMERIC} minPrice - Minimum product price
   * @column {NUMERIC} maxPrice - Maximum product price
   */
  SELECT
    MIN([prdSrchIdx].[price]) AS [minPrice],
    MAX([prdSrchIdx].[price]) AS [maxPrice]
  FROM [functional].[productSearchIndex] [prdSrchIdx]
  WHERE [prdSrchIdx].[idAccount] = @idAccount
    AND [prdSrchIdx].[deleted] = 0;

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
    MIN([prdSrchIdx].[height]) AS [minHeight],
    MAX([prdSrchIdx].[height]) AS [maxHeight],
    MIN([prdSrchIdx].[width]) AS [minWidth],
    MAX([prdSrchIdx].[width]) AS [maxWidth],
    MIN([prdSrchIdx].[depth]) AS [minDepth],
    MAX([prdSrchIdx].[depth]) AS [maxDepth]
  FROM [functional].[productSearchIndex] [prdSrchIdx]
  WHERE [prdSrchIdx].[idAccount] = @idAccount
    AND [prdSrchIdx].[deleted] = 0;
END;
GO