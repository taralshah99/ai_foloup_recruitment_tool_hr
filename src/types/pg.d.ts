declare module 'pg' {
  export interface PoolConfig {
    connectionString?: string;
    ssl?: {
      rejectUnauthorized?: boolean;
    };
    [key: string]: any;
  }

  export class Pool {
    constructor(config?: PoolConfig);
    query(text: string, values?: any[]): Promise<{ rows: any[]; rowCount: number }>;
    end(): Promise<void>;
  }

  export default Pool;
} 
