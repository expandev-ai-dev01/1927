/*
DROP TABLE IF EXISTS [functional].[searchHistory];
DROP TABLE IF EXISTS [functional].[searchSynonym];
DROP TABLE IF EXISTS [functional].[productSearchIndex];
DROP SCHEMA IF EXISTS [functional];
*/

/**
 * @schema functional
 * Business logic schema for product catalog and search functionality
 */
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'functional')
BEGIN
  EXEC('CREATE SCHEMA [functional]');
END;
GO

/**
 * @table searchSynonym Stores synonym mappings for search term expansion
 * @multitenancy false
 * @softDelete false
 * @alias synm
 */
CREATE TABLE [functional].[searchSynonym] (
  [idSynonym] INTEGER IDENTITY(1, 1) NOT NULL,
  [term] NVARCHAR(100) NOT NULL,
  [synonym] NVARCHAR(100) NOT NULL,
  [category] NVARCHAR(50) NULL,
  [dateCreated] DATETIME2 NOT NULL DEFAULT (GETUTCDATE())
);

/**
 * @primaryKey pkSearchSynonym
 * @keyType Object
 */
ALTER TABLE [functional].[searchSynonym]
ADD CONSTRAINT [pkSearchSynonym] PRIMARY KEY CLUSTERED ([idSynonym]);

/**
 * @index ixSearchSynonym_Term
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixSearchSynonym_Term]
ON [functional].[searchSynonym]([term]);

/**
 * @table searchHistory Stores user search history for analytics and personalization
 * @multitenancy false
 * @softDelete false
 * @alias srchHst
 */
CREATE TABLE [functional].[searchHistory] (
  [idSearchHistory] INTEGER IDENTITY(1, 1) NOT NULL,
  [sessionId] NVARCHAR(100) NOT NULL,
  [searchTerm] NVARCHAR(100) NOT NULL,
  [filters] NVARCHAR(MAX) NULL,
  [resultCount] INTEGER NOT NULL,
  [dateSearched] DATETIME2 NOT NULL DEFAULT (GETUTCDATE())
);

/**
 * @primaryKey pkSearchHistory
 * @keyType Object
 */
ALTER TABLE [functional].[searchHistory]
ADD CONSTRAINT [pkSearchHistory] PRIMARY KEY CLUSTERED ([idSearchHistory]);

/**
 * @index ixSearchHistory_Session_Date
 * @type Performance
 */
CREATE NONCLUSTERED INDEX [ixSearchHistory_Session_Date]
ON [functional].[searchHistory]([sessionId], [dateSearched] DESC);

/**
 * @index ixSearchHistory_Term
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixSearchHistory_Term]
ON [functional].[searchHistory]([searchTerm]);

/**
 * @table productSearchIndex Denormalized search index for product catalog
 * @multitenancy false
 * @softDelete true
 * @alias prdSrchIdx
 */
CREATE TABLE [functional].[productSearchIndex] (
  [idProduct] INTEGER NOT NULL,
  [productCode] VARCHAR(50) NOT NULL,
  [name] NVARCHAR(200) NOT NULL,
  [description] NVARCHAR(MAX) NULL,
  [category] NVARCHAR(100) NULL,
  [material] NVARCHAR(100) NULL,
  [color] NVARCHAR(50) NULL,
  [style] NVARCHAR(50) NULL,
  [price] NUMERIC(18, 6) NOT NULL,
  [height] NUMERIC(15, 2) NULL,
  [width] NUMERIC(15, 2) NULL,
  [depth] NUMERIC(15, 2) NULL,
  [searchableText] NVARCHAR(MAX) NOT NULL,
  [imageUrl] NVARCHAR(500) NULL,
  [dateCreated] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [dateModified] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [deleted] BIT NOT NULL DEFAULT (0)
);

/**
 * @primaryKey pkProductSearchIndex
 * @keyType Object
 */
ALTER TABLE [functional].[productSearchIndex]
ADD CONSTRAINT [pkProductSearchIndex] PRIMARY KEY CLUSTERED ([idProduct]);

/**
 * @index ixProductSearchIndex_Code
 * @type Search
 * @filter Active products only
 */
CREATE NONCLUSTERED INDEX [ixProductSearchIndex_Code]
ON [functional].[productSearchIndex]([productCode])
WHERE [deleted] = 0;

/**
 * @index ixProductSearchIndex_Category
 * @type Search
 * @filter Active products only
 */
CREATE NONCLUSTERED INDEX [ixProductSearchIndex_Category]
ON [functional].[productSearchIndex]([category])
INCLUDE ([name], [price], [imageUrl])
WHERE [deleted] = 0;

/**
 * @index ixProductSearchIndex_Price
 * @type Search
 * @filter Active products only
 */
CREATE NONCLUSTERED INDEX [ixProductSearchIndex_Price]
ON [functional].[productSearchIndex]([price])
WHERE [deleted] = 0;

/**
 * @index ixProductSearchIndex_Material
 * @type Search
 * @filter Active products only
 */
CREATE NONCLUSTERED INDEX [ixProductSearchIndex_Material]
ON [functional].[productSearchIndex]([material])
WHERE [deleted] = 0;

/**
 * @index ixProductSearchIndex_Deleted
 * @type SoftDelete
 */
CREATE NONCLUSTERED INDEX [ixProductSearchIndex_Deleted]
ON [functional].[productSearchIndex]([deleted]);
GO