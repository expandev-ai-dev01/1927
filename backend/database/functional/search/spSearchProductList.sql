/**
 * @summary
 * Performs comprehensive product search with support for keywords, filters,
 * synonym expansion, and multiple sorting options. Returns paginated results
 * with relevance scoring.
 *
 * @procedure spSearchProductList
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/search/products
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy isolation
 *
 * @param {NVARCHAR(100)} searchTerm
 *   - Required: No
 *   - Description: Search term entered by user (minimum 2 characters)
 *
 * @param {NVARCHAR(50)} productCode
 *   - Required: No
 *   - Description: Specific product code for exact match search
 *
 * @param {NVARCHAR(MAX)} categories
 *   - Required: No
 *   - Description: JSON array of category names for filtering
 *
 * @param {NUMERIC(18,6)} priceMin
 *   - Required: No
 *   - Description: Minimum price filter (null = no minimum)
 *
 * @param {NUMERIC(18,6)} priceMax
 *   - Required: No
 *   - Description: Maximum price filter (null = no maximum)
 *
 * @param {NVARCHAR(MAX)} materials
 *   - Required: No
 *   - Description: JSON array of material names for filtering
 *
 * @param {NVARCHAR(MAX)} colors
 *   - Required: No
 *   - Description: JSON array of color names for filtering
 *
 * @param {NVARCHAR(MAX)} styles
 *   - Required: No
 *   - Description: JSON array of style names for filtering
 *
 * @param {NUMERIC(15,2)} heightMin
 *   - Required: No
 *   - Description: Minimum height in cm (null = no minimum)
 *
 * @param {NUMERIC(15,2)} heightMax
 *   - Required: No
 *   - Description: Maximum height in cm (null = no maximum)
 *
 * @param {NUMERIC(15,2)} widthMin
 *   - Required: No
 *   - Description: Minimum width in cm (null = no minimum)
 *
 * @param {NUMERIC(15,2)} widthMax
 *   - Required: No
 *   - Description: Maximum width in cm (null = no maximum)
 *
 * @param {NUMERIC(15,2)} depthMin
 *   - Required: No
 *   - Description: Minimum depth in cm (null = no minimum)
 *
 * @param {NUMERIC(15,2)} depthMax
 *   - Required: No
 *   - Description: Maximum depth in cm (null = no maximum)
 *
 * @param {NVARCHAR(50)} sortBy
 *   - Required: No
 *   - Description: Sort criteria (relevancia, nome_asc, nome_desc, preco_asc, preco_desc, data_cadastro_desc)
 *
 * @param {INT} page
 *   - Required: No
 *   - Description: Page number for pagination (default: 1)
 *
 * @param {INT} pageSize
 *   - Required: No
 *   - Description: Items per page (default: 24, allowed: 12, 24, 36, 48)
 *
 * @testScenarios
 * - Valid search with keyword and filters
 * - Search with synonym expansion
 * - Search by product code
 * - Search with price range filters
 * - Search with dimension filters
 * - Search with multiple filter types combined
 * - Pagination with different page sizes
 * - Different sorting options
 * - Search with no results
 * - Invalid parameter validation
 */
CREATE OR ALTER PROCEDURE [functional].[spSearchProductList]
  @idAccount INTEGER,
  @searchTerm NVARCHAR(100) = NULL,
  @productCode NVARCHAR(50) = NULL,
  @categories NVARCHAR(MAX) = NULL,
  @priceMin NUMERIC(18, 6) = NULL,
  @priceMax NUMERIC(18, 6) = NULL,
  @materials NVARCHAR(MAX) = NULL,
  @colors NVARCHAR(MAX) = NULL,
  @styles NVARCHAR(MAX) = NULL,
  @heightMin NUMERIC(15, 2) = NULL,
  @heightMax NUMERIC(15, 2) = NULL,
  @widthMin NUMERIC(15, 2) = NULL,
  @widthMax NUMERIC(15, 2) = NULL,
  @depthMin NUMERIC(15, 2) = NULL,
  @depthMax NUMERIC(15, 2) = NULL,
  @sortBy NVARCHAR(50) = 'relevancia',
  @page INTEGER = 1,
  @pageSize INTEGER = 24
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
   * @validation Validate search term length
   * @throw {searchTermTooShort}
   */
  IF (@searchTerm IS NOT NULL AND LEN(@searchTerm) < 2)
  BEGIN
    ;THROW 51000, 'searchTermTooShort', 1;
  END;

  /**
   * @validation Validate price range
   * @throw {invalidPriceRange}
   */
  IF (@priceMin IS NOT NULL AND @priceMax IS NOT NULL AND @priceMax < @priceMin)
  BEGIN
    ;THROW 51000, 'invalidPriceRange', 1;
  END;

  /**
   * @validation Validate dimension ranges
   * @throw {invalidDimensionRange}
   */
  IF ((@heightMin IS NOT NULL AND @heightMax IS NOT NULL AND @heightMax < @heightMin)
    OR (@widthMin IS NOT NULL AND @widthMax IS NOT NULL AND @widthMax < @widthMin)
    OR (@depthMin IS NOT NULL AND @depthMax IS NOT NULL AND @depthMax < @depthMin))
  BEGIN
    ;THROW 51000, 'invalidDimensionRange', 1;
  END;

  /**
   * @validation Validate page number
   * @throw {invalidPageNumber}
   */
  IF (@page < 1)
  BEGIN
    ;THROW 51000, 'invalidPageNumber', 1;
  END;

  /**
   * @validation Validate page size
   * @throw {invalidPageSize}
   */
  IF (@pageSize NOT IN (12, 24, 36, 48))
  BEGIN
    ;THROW 51000, 'invalidPageSize', 1;
  END;

  /**
   * @validation Validate sort criteria
   * @throw {invalidSortCriteria}
   */
  IF (@sortBy NOT IN ('relevancia', 'nome_asc', 'nome_desc', 'preco_asc', 'preco_desc', 'data_cadastro_desc'))
  BEGIN
    ;THROW 51000, 'invalidSortCriteria', 1;
  END;

  DECLARE @offset INTEGER = (@page - 1) * @pageSize;
  DECLARE @expandedSearchTerms TABLE ([term] NVARCHAR(100));

  /**
   * @rule {fn-search-synonym-expansion} Expand search term with synonyms
   */
  IF (@searchTerm IS NOT NULL)
  BEGIN
    INSERT INTO @expandedSearchTerms ([term])
    SELECT DISTINCT LOWER(@searchTerm);

    INSERT INTO @expandedSearchTerms ([term])
    SELECT DISTINCT LOWER([synm].[synonym])
    FROM [functional].[searchSynonym] [synm]
    WHERE LOWER([synm].[term]) = LOWER(@searchTerm);

    INSERT INTO @expandedSearchTerms ([term])
    SELECT DISTINCT LOWER([synm].[term])
    FROM [functional].[searchSynonym] [synm]
    WHERE LOWER([synm].[synonym]) = LOWER(@searchTerm);
  END;

  /**
   * @rule {fn-search-filtering} Apply cumulative filters with AND logic between filter types
   */
  WITH [FilteredProducts] AS (
    SELECT
      [prdSrchIdx].[idProduct],
      [prdSrchIdx].[productCode],
      [prdSrchIdx].[name],
      [prdSrchIdx].[description],
      [prdSrchIdx].[category],
      [prdSrchIdx].[material],
      [prdSrchIdx].[color],
      [prdSrchIdx].[style],
      [prdSrchIdx].[price],
      [prdSrchIdx].[height],
      [prdSrchIdx].[width],
      [prdSrchIdx].[depth],
      [prdSrchIdx].[dateCreated],
      CASE
        WHEN @productCode IS NOT NULL AND LOWER([prdSrchIdx].[productCode]) = LOWER(@productCode) THEN 100
        WHEN @searchTerm IS NOT NULL AND EXISTS (
          SELECT 1 FROM @expandedSearchTerms [expTrm]
          WHERE LOWER([prdSrchIdx].[name]) LIKE '%' + [expTrm].[term] + '%'
        ) THEN 90
        WHEN @searchTerm IS NOT NULL AND EXISTS (
          SELECT 1 FROM @expandedSearchTerms [expTrm]
          WHERE LOWER([prdSrchIdx].[searchableText]) LIKE '%' + [expTrm].[term] + '%'
        ) THEN 70
        ELSE 50
      END AS [relevanceScore]
    FROM [functional].[productSearchIndex] [prdSrchIdx]
    WHERE [prdSrchIdx].[idAccount] = @idAccount
      AND [prdSrchIdx].[deleted] = 0
      AND (
        @productCode IS NULL
        OR LOWER([prdSrchIdx].[productCode]) = LOWER(@productCode)
      )
      AND (
        @searchTerm IS NULL
        OR EXISTS (
          SELECT 1 FROM @expandedSearchTerms [expTrm]
          WHERE LOWER([prdSrchIdx].[searchableText]) LIKE '%' + [expTrm].[term] + '%'
        )
      )
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
      AND (
        @heightMin IS NULL
        OR [prdSrchIdx].[height] >= @heightMin
      )
      AND (
        @heightMax IS NULL
        OR [prdSrchIdx].[height] <= @heightMax
      )
      AND (
        @widthMin IS NULL
        OR [prdSrchIdx].[width] >= @widthMin
      )
      AND (
        @widthMax IS NULL
        OR [prdSrchIdx].[width] <= @widthMax
      )
      AND (
        @depthMin IS NULL
        OR [prdSrchIdx].[depth] >= @depthMin
      )
      AND (
        @depthMax IS NULL
        OR [prdSrchIdx].[depth] <= @depthMax
      )
  )
  /**
   * @output {SearchResults, n, n}
   * @column {INT} idProduct - Product identifier
   * @column {NVARCHAR} productCode - Product code
   * @column {NVARCHAR} name - Product name
   * @column {NVARCHAR} description - Product description
   * @column {NVARCHAR} category - Product category
   * @column {NVARCHAR} material - Product material
   * @column {NVARCHAR} color - Product color
   * @column {NVARCHAR} style - Product style
   * @column {NUMERIC} price - Product price
   * @column {NUMERIC} height - Product height in cm
   * @column {NUMERIC} width - Product width in cm
   * @column {NUMERIC} depth - Product depth in cm
   * @column {DATETIME2} dateCreated - Product creation date
   * @column {INT} totalResults - Total number of results
   * @column {INT} totalPages - Total number of pages
   * @column {INT} currentPage - Current page number
   */
  SELECT
    [fltPrd].[idProduct],
    [fltPrd].[productCode],
    [fltPrd].[name],
    [fltPrd].[description],
    [fltPrd].[category],
    [fltPrd].[material],
    [fltPrd].[color],
    [fltPrd].[style],
    [fltPrd].[price],
    [fltPrd].[height],
    [fltPrd].[width],
    [fltPrd].[depth],
    [fltPrd].[dateCreated],
    COUNT(*) OVER() AS [totalResults],
    CEILING(CAST(COUNT(*) OVER() AS FLOAT) / @pageSize) AS [totalPages],
    @page AS [currentPage]
  FROM [FilteredProducts] [fltPrd]
  ORDER BY
    CASE WHEN @sortBy = 'relevancia' THEN [fltPrd].[relevanceScore] END DESC,
    CASE WHEN @sortBy = 'nome_asc' THEN [fltPrd].[name] END ASC,
    CASE WHEN @sortBy = 'nome_desc' THEN [fltPrd].[name] END DESC,
    CASE WHEN @sortBy = 'preco_asc' THEN [fltPrd].[price] END ASC,
    CASE WHEN @sortBy = 'preco_desc' THEN [fltPrd].[price] END DESC,
    CASE WHEN @sortBy = 'data_cadastro_desc' THEN [fltPrd].[dateCreated] END DESC
  OFFSET @offset ROWS
  FETCH NEXT @pageSize ROWS ONLY;
END;
GO