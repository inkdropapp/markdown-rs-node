import type { Root } from 'mdast'
import type { ParseOptions } from './binding'

export type { ParseOptions }

/**
 * Parse a markdown string into an MDAST tree.
 *
 * Internally calls `toMdastJson` and `JSON.parse`s the result, which is
 * faster than building the JS object tree directly via N-API.
 */
export declare function toMdast(source: string, options?: ParseOptions | null): Root

/**
 * Parse a markdown string and return the MDAST tree as a JSON string.
 *
 * Useful when you don't need the parsed object — e.g. to write to disk,
 * send across an IPC boundary, or cache. Otherwise prefer `toMdast`.
 */
export { toMdastJson } from './binding'
