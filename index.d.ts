import { AsyncLocalStorage } from 'async_hooks';

/** Express.js middleware that is responsible for initializing the context for each request. */
export declare function middleware(
  req: any,
  res: any,
  next: (err?: any) => void
): void;

/**
 * Gets a value from the context by key.  Will return undefined if the context has not yet been initialized for this request or if a value is not found for the specified key.
 */
export declare function get(key: string): any;

/**
 * Adds a value to the context by key.  If the key already exists, its value will be overwritten.  No value will persist if the context has not yet been initialized.
 */
export declare function set(key: string, value: any): void;

/**
 * Gets the instance of AsyncLocalStorage that is used to store the context for each request.
 */
export declare const asyncLocalStorage: AsyncLocalStorage<Map<string, unknown>>;
