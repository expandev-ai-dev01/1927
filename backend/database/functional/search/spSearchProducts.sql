/**
 * @summary
 * Performs comprehensive product search with support for keywords, filters,
 * synonym expansion, and relevance ranking. Returns paginated results with
 * applied filters and total count.
 *
 * @procedure spSearchProducts
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - POST /api/v1/external/public/search
 *
 * @parameters
 * @param {NVARCHAR(100)} searchTerm
 *   - Required: No
 *   - Description: Search term entered by user (minimum 2 characters)
 *
 * @param {VARCHAR(50)} productCode
 *   - Required: No
 *   - Description: Specific product code for exact match search
 *
 * @param {NVARCHAR(MAX)} categories
 *   - Required: No
 *   - Description: JSON array of category names to filter
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
 *   - Description: JSON array of material names to filter
 *
 * @param {NVARCHAR(MAX)} colors
 *   - Required: No
 *   - Description: JSON array of color names to filter
 *
 * @param {NVARCHAR(MAX)} styles
 *   - Required: No
 *   - Description: JSON array of style names to filter
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
 *   - Description: Page number (default 1)
 *
 * @param {INT} pageSize
 *   - Required: No
 *   - Description: Items per page (default 24, allowed: 12, 24, 36, 48)
 *
 * @param {NVARCHAR(100)} sessionId
 *   - Required: No
 *   - Description: Session identifier for search history tracking
 *
 * @testScenarios
 * - Valid search with term only
 * - Search with product code exact match
 * - Search with multiple filters applied
 * - Search with price range filters
 * - Search with dimension filters
 * - Search with synonym expansion
 * - Search with no results
 * - Search with pagination
 * - Search with different sort orders
 */
CREATE OR ALTER PROCEDURE [functional].[spSearchProducts]
  @searchTerm NVARCHAR(100) = NULL,
  @productCode VARCHAR(50) = NULL,
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
  @page INT = 1,
  @pageSize INT = 24,
  @sessionId NVARCHAR(100) = NULL
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Validate search term length
   * @throw {searchTermTooShort}
   */
  IF (@searchTerm IS NOT NULL AND LEN(@searchTerm) < 2)
  BEGIN
    ;THROW 51000, 'searchTermTooShort', 1;
  END;

  /**
   * @validation Validate search term maximum length
   * @throw {searchTermTooLong}
   */
  IF (@searchTerm IS NOT NULL AND LEN(@searchTerm) > 100)
  BEGIN
    ;THROW 51000, 'searchTermTooLong', 1;
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
   * @validation Validate page size
   * @throw {invalidPageSize}
   */
  IF (@pageSize NOT IN (12, 24, 36, 48))
  BEGIN
    ;THROW 51000, 'invalidPageSize', 1;
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
   * @rule {fn-search-synonym-expansion} Expand search term with synonyms
   */
  DECLARE @expandedTerms TABLE (
    [term] NVARCHAR(100)
  );

  IF (@searchTerm IS NOT NULL)
  BEGIN
    INSERT INTO @expandedTerms ([term])
    SELECT DISTINCT @searchTerm
    UNION
    SELECT DISTINCT [synm].[synonym]
    FROM [functional].[searchSynonym] [synm]
    WHERE [synm].[term] = LOWER(@searchTerm);
  END;

  /**
   * @rule {fn-search-filter-application} Apply cumulative filters with AND logic between filter types
   */
  DECLARE @categoryFilter TABLE ([category] NVARCHAR(100));
  DECLARE @materialFilter TABLE ([material] NVARCHAR(100));
  DECLARE @colorFilter TABLE ([color] NVARCHAR(50));
  DECLARE @styleFilter TABLE ([style] NVARCHAR(50));

  IF (@categories IS NOT NULL)
  BEGIN
    INSERT INTO @categoryFilter ([category])
    SELECT [value]
    FROM OPENJSON(@categories);
  END;

  IF (@materials IS NOT NULL)
  BEGIN
    INSERT INTO @materialFilter ([material])
    SELECT [value]
    FROM OPENJSON(@materials);
  END;

  IF (@colors IS NOT NULL)
  BEGIN
    INSERT INTO @colorFilter ([color])
    SELECT [value]
    FROM OPENJSON(@colors);
  END;

  IF (@styles IS NOT NULL)
  BEGIN
    INSERT INTO @styleFilter ([style])
    SELECT [value]
    FROM OPENJSON(@styles);
  END;

  /**
   * @rule {fn-search-relevance-ranking} Calculate relevance score for search results
   */
  DECLARE @results TABLE (
    [idProduct] INTEGER,
    [productCode] VARCHAR(50),
    [name] NVARCHAR(200),
    [description] NVARCHAR(MAX),
    [category] NVARCHAR(100),
    [material] NVARCHAR(100),
    [color] NVARCHAR(50),
    [style] NVARCHAR(50),
    [price] NUMERIC(18, 6),
    [height] NUMERIC(15, 2),
    [width] NUMERIC(15, 2),
    [depth] NUMERIC(15, 2),
    [imageUrl] NVARCHAR(500),
    [dateCreated] DATETIME2,
    [relevanceScore] INT
  );

  INSERT INTO @results
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
    [prdSrchIdx].[imageUrl],
    [prdSrchIdx].[dateCreated],
    CASE
      WHEN (@productCode IS NOT NULL AND [prdSrchIdx].[productCode] = @productCode) THEN 1000
      WHEN (@searchTerm IS NOT NULL AND [prdSrchIdx].[name] = @searchTerm) THEN 100
      WHEN (@searchTerm IS NOT NULL AND [prdSrchIdx].[name] LIKE @searchTerm + '%') THEN 90
      WHEN (@searchTerm IS NOT NULL AND [prdSrchIdx].[name] LIKE '%' + @searchTerm + '%') THEN 80
      WHEN EXISTS (SELECT 1 FROM @expandedTerms [expTrm] WHERE [prdSrchIdx].[searchableText] LIKE '%' + [expTrm].[term] + '%') THEN 70
      ELSE 50
    END AS [relevanceScore]
  FROM [functional].[productSearchIndex] [prdSrchIdx]
  WHERE [prdSrchIdx].[deleted] = 0
    AND (
      @productCode IS NULL
      OR [prdSrchIdx].[productCode] = @productCode
    )
    AND (
      @searchTerm IS NULL
      OR [prdSrchIdx].[searchableText] LIKE '%' + @searchTerm + '%'
      OR EXISTS (SELECT 1 FROM @expandedTerms [expTrm] WHERE [prdSrchIdx].[searchableText] LIKE '%' + [expTrm].[term] + '%')
    )
    AND (
      NOT EXISTS (SELECT 1 FROM @categoryFilter)
      OR [prdSrchIdx].[category] IN (SELECT [category] FROM @categoryFilter)
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
    AND (
      @heightMin IS NULL
      OR [prdSrchIdx].[height] IS NULL
      OR [prdSrchIdx].[height] >= @heightMin
    )
    AND (
      @heightMax IS NULL
      OR [prdSrchIdx].[height] IS NULL
      OR [prdSrchIdx].[height] <= @heightMax
    )
    AND (
      @widthMin IS NULL
      OR [prdSrchIdx].[width] IS NULL
      OR [prdSrchIdx].[width] >= @widthMin
    )
    AND (
      @widthMax IS NULL
      OR [prdSrchIdx].[width] IS NULL
      OR [prdSrchIdx].[width] <= @widthMax
    )
    AND (
      @depthMin IS NULL
      OR [prdSrchIdx].[depth] IS NULL
      OR [prdSrchIdx].[depth] >= @depthMin
    )
    AND (
      @depthMax IS NULL
      OR [prdSrchIdx].[depth] IS NULL
      OR [prdSrchIdx].[depth] <= @depthMax
    );

  DECLARE @totalResults INT = (SELECT COUNT(*) FROM @results);
  DECLARE @offset INT = (@page - 1) * @pageSize;

  /**
   * @rule {fn-search-history-tracking} Store search in history for analytics
   */
  IF (@sessionId IS NOT NULL)
  BEGIN
    INSERT INTO [functional].[searchHistory]
    ([sessionId], [searchTerm], [filters], [resultCount])
    VALUES
    (
      @sessionId,
      ISNULL(@searchTerm, @productCode),
      JSON_QUERY((SELECT
        @categories AS [categories],
        @priceMin AS [priceMin],
        @priceMax AS [priceMax],
        @materials AS [materials],
        @colors AS [colors],
        @styles AS [styles]
        FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)),
      @totalResults
    );
  END;

  /**
   * @output {SearchResults, n, n}
   * @column {INT} idProduct - Product identifier
   * @column {VARCHAR} productCode - Product code
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
   * @column {NVARCHAR} imageUrl - Product image URL
   * @column {DATETIME2} dateCreated - Product creation date
   */
  SELECT
    [res].[idProduct],
    [res].[productCode],
    [res].[name],
    [res].[description],
    [res].[category],
    [res].[material],
    [res].[color],
    [res].[style],
    [res].[price],
    [res].[height],
    [res].[width],
    [res].[depth],
    [res].[imageUrl],
    [res].[dateCreated]
  FROM @results [res]
  ORDER BY
    CASE WHEN @sortBy = 'relevancia' THEN [res].[relevanceScore] END DESC,
    CASE WHEN @sortBy = 'nome_asc' THEN [res].[name] END ASC,
    CASE WHEN @sortBy = 'nome_desc' THEN [res].[name] END DESC,
    CASE WHEN @sortBy = 'preco_asc' THEN [res].[price] END ASC,
    CASE WHEN @sortBy = 'preco_desc' THEN [res].[price] END DESC,
    CASE WHEN @sortBy = 'data_cadastro_desc' THEN [res].[dateCreated] END DESC
  OFFSET @offset ROWS
  FETCH NEXT @pageSize ROWS ONLY;

  /**
   * @output {SearchMetadata, 1, n}
   * @column {INT} totalResults - Total number of results found
   * @column {INT} page - Current page number
   * @column {INT} pageSize - Items per page
   * @column {INT} totalPages - Total number of pages
   */
  SELECT
    @totalResults AS [totalResults],
    @page AS [page],
    @pageSize AS [pageSize],
    CEILING(CAST(@totalResults AS FLOAT) / @pageSize) AS [totalPages];
END;
GO