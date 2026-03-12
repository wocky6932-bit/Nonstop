declare module 'better-sqlite3' {
  export interface Database {
    prepare(sql: string): Statement
    exec(sql: string): void
    pragma(name: string): any
    close(): void
  }
  
  export interface Statement {
    run(...params: any[]): { lastInsertRowid: number; changes: number }
    get(...params: any[]): any
    all(...params: any[]): any[]
    each(...params: any[]): void
  }
  
  export default class Database {
    constructor(filename: string)
    prepare(sql: string): Statement
    exec(sql: string): void
    pragma(name: string): any
    close(): void
  }
}
