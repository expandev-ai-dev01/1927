/**
 * @summary
 * Retrieves available filter options dynamically from the product catalog.
 * Returns distinct values for categories, materials, colors, styles, and price/dimension ranges.
 *
 * @procedure spSearchGetFilterOptions
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/external/public/search/filter-options
 *
 * @parameters
 * @param {NVARCHAR(MAX)} appliedCategories
 *   - Required: No
 *   - Description: JSON array of already applied category filters for progressive refinement
 *
 * @param {NVARCHAR(MAX)} appliedMaterials
 *   - Required: No
 *   - Description: JSON array of already applied material filters
 *
 * @param {NVARCHAR(MAX)} appliedColors
 *   - Required: No
 *   - Description: JSON array of already applied color filters
 *
 * @param {NVARCHAR(MAX)} appliedStyles
 *   - Required: No
 *   - Description: JSON array of already applied style filters
 *
 * @testScenarios
 * - Get all filter options without applied filters
 * - Get refined filter options with some filters applied
 * - Get filter options with all filters applied
 */
CREATE OR ALTER PROCEDURE [functional].[spSearchGetFilterOptions]
  @appliedCategories NVARCHAR(MAX) = NULL,
  @appliedMaterials NVARCHAR(MAX) = NULL,
  @appliedColors NVARCHAR(MAX) = NULL,
  @appliedStyles NVARCHAR(MAX) = NULL
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @rule {fn-filter-progressive-refinement} Apply progressive refinement based on already selected filters
   */
  DECLARE @categoryFilter TABLE ([category] NVARCHAR(100));
  DECLARE @materialFilter TABLE ([material] NVARCHAR(100));
  DECLARE @colorFilter TABLE ([color] NVARCHAR(50));
  DECLARE @styleFilter TABLE ([style] NVARCHAR(50));

  IF (@appliedCategories IS NOT NULL)
  BEGIN
    INSERT INTO @categoryFilter ([category])
    SELECT [value]
    FROM OPENJSON(@appliedCategories);
  END;

  IF (@appliedMaterials IS NOT NULL)
  BEGIN
    INSERT INTO @materialFilter ([material])
    SELECT [value]
    FROM OPENJSON(@appliedMaterials);
  END;

  IF (@appliedColors IS NOT NULL)
  BEGIN
    INSERT INTO @colorFilter ([color])
    SELECT [value]
    FROM OPENJSON(@appliedColors);
  END;

  IF (@appliedStyles IS NOT NULL)
  BEGIN
    INSERT INTO @styleFilter ([style])
    SELECT [value]
    FROM OPENJSON(@appliedStyles);
  END;

  /**
   * @output {AvailableCategories, n, n}
   * @column {NVARCHAR} category - Category name
   * @column {INT} productCount - Number of products in this category
   */
  SELECT DISTINCT
    [prdSrchIdx].[category],
    COUNT(*) AS [productCount]
  FROM [functional].[productSearchIndex] [prdSrchIdx]
  WHERE [prdSrchIdx].[deleted] = 0
    AND [prdSrchIdx].[category] IS NOT NULL
    AND (
      NOT EXISTS (SELECT 1 FROM @materialFilter)
      OR [prdSrchIdx].[material] IN (SELECT [material] FROM @materialFilter)
    )
    AND (
      NOT EXISTS (SELECT 1 FROM @colorFilter)
      OR [prdSrchIdx].[color] IN (SELECT [color] FROM @colorFilter)
    )
    AND (
      NOT EXISTS (SELECT 1 FROM @styleFilter)
      OR [prdSrchIdx].[style] IN (SELECT [style] FROM @styleFilter)
    )
  GROUP BY [prdSrchIdx].[category]
  ORDER BY [prdSrchIdx].[category];

  /**
   * @output {AvailableMaterials, n, n}
   * @column {NVARCHAR} material - Material name
   * @column {INT} productCount - Number of products with this material
   */
  SELECT DISTINCT
    [prdSrchIdx].[material],
    COUNT(*) AS [productCount]
  FROM [functional].[productSearchIndex] [prdSrchIdx]
  WHERE [prdSrchIdx].[deleted] = 0
    AND [prdSrchIdx].[material] IS NOT NULL
    AND (
      NOT EXISTS (SELECT 1 FROM @categoryFilter)
      OR [prdSrchIdx].[category] IN (SELECT [category] FROM @categoryFilter)
    )
    AND (
      NOT EXISTS (SELECT 1 FROM @colorFilter)
      OR [prdSrchIdx].[color] IN (SELECT [color] FROM @colorFilter)
    )
    AND (
      NOT EXISTS (SELECT 1 FROM @styleFilter)
      OR [prdSrchIdx].[style] IN (SELECT [style] FROM @styleFilter)
    )
  GROUP BY [prdSrchIdx].[material]
  ORDER BY [prdSrchIdx].[material];

  /**
   * @output {AvailableColors, n, n}
   * @column {NVARCHAR} color - Color name
   * @column {INT} productCount - Number of products with this color
   */
  SELECT DISTINCT
    [prdSrchIdx].[color],
    COUNT(*) AS [productCount]
  FROM [functional].[productSearchIndex] [prdSrchIdx]
  WHERE [prdSrchIdx].[deleted] = 0
    AND [prdSrchIdx].[color] IS NOT NULL
    AND (
      NOT EXISTS (SELECT 1 FROM @categoryFilter)
      OR [prdSrchIdx].[category] IN (SELECT [category] FROM @categoryFilter)
    )
    AND (
      NOT EXISTS (SELECT 1 FROM @materialFilter)
      OR [prdSrchIdx].[material] IN (SELECT [material] FROM @materialFilter)
    )
    AND (
      NOT EXISTS (SELECT 1 FROM @styleFilter)
      OR [prdSrchIdx].[style] IN (SELECT [style] FROM @styleFilter)
    )
  GROUP BY [prdSrchIdx].[color]
  ORDER BY [prdSrchIdx].[color];

  /**
   * @output {AvailableStyles, n, n}
   * @column {NVARCHAR} style - Style name
   * @column {INT} productCount - Number of products with this style
   */
  SELECT DISTINCT
    [prdSrchIdx].[style],
    COUNT(*) AS [productCount]
  FROM [functional].[productSearchIndex] [prdSrchIdx]
  WHERE [prdSrchIdx].[deleted] = 0
    AND [prdSrchIdx].[style] IS NOT NULL
    AND (
      NOT EXISTS (SELECT 1 FROM @categoryFilter)
      OR [prdSrchIdx].[category] IN (SELECT [category] FROM @categoryFilter)
    )
    AND (
      NOT EXISTS (SELECT 1 FROM @materialFilter)
      OR [prdSrchIdx].[material] IN (SELECT [material] FROM @materialFilter)
    )
    AND (
      NOT EXISTS (SELECT 1 FROM @colorFilter)
      OR [prdSrchIdx].[color] IN (SELECT [color] FROM @colorFilter)
    )
  GROUP BY [prdSrchIdx].[style]
  ORDER BY [prdSrchIdx].[style];

  /**
   * @output {PriceRange, 1, n}
   * @column {NUMERIC} minPrice - Minimum price in catalog
   * @column {NUMERIC} maxPrice - Maximum price in catalog
   */
  SELECT
    MIN([prdSrchIdx].[price]) AS [minPrice],
    MAX([prdSrchIdx].[price]) AS [maxPrice]
  FROM [functional].[productSearchIndex] [prdSrchIdx]
  WHERE [prdSrchIdx].[deleted] = 0;

  /**
   * @output {DimensionRanges, 1, n}
   * @column {NUMERIC} minHeight - Minimum height in catalog (cm)
   * @column {NUMERIC} maxHeight - Maximum height in catalog (cm)
   * @column {NUMERIC} minWidth - Minimum width in catalog (cm)
   * @column {NUMERIC} maxWidth - Maximum width in catalog (cm)
   * @column {NUMERIC} minDepth - Minimum depth in catalog (cm)
   * @column {NUMERIC} maxDepth - Maximum depth in catalog (cm)
   */
  SELECT
    MIN([prdSrchIdx].[height]) AS [minHeight],
    MAX([prdSrchIdx].[height]) AS [maxHeight],
    MIN([prdSrchIdx].[width]) AS [minWidth],
    MAX([prdSrchIdx].[width]) AS [maxWidth],
    MIN([prdSrchIdx].[depth]) AS [minDepth],
    MAX([prdSrchIdx].[depth]) AS [maxDepth]
  FROM [functional].[productSearchIndex] [prdSrchIdx]
  WHERE [prdSrchIdx].[deleted] = 0;
END;
GO