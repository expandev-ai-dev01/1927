/**
 * @summary
 * Database utility functions for SQL Server operations
 *
 * @module database
 */

export enum ExpectedReturn {
  Single = 'Single',
  Multiple = 'Multiple',
  Multi = 'Multi',
}

export interface IRecordSet<T = any> extends Array<T> {}

/**
 * @summary
 * Executes a stored procedure and returns results
 *
 * @function dbRequest
 * @module database
 *
 * @param {string} procedure - Stored procedure name
 * @param {object} parameters - Procedure parameters
 * @param {ExpectedReturn} expectedReturn - Expected return type
 *
 * @returns {Promise<any>} Query results
 *
 * @throws {DatabaseError} When database operation fails
 */
export async function dbRequest(
  procedure: string,
  parameters: object,
  expectedReturn: ExpectedReturn
): Promise<any> {
  // This is a placeholder implementation
  // Actual implementation would use mssql package
  throw new Error('Database connection not implemented');
}
