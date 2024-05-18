import { Pool } from 'pg'
import { config } from 'dotenv';
config();

const getPool = () => {
    const pool = new Pool({
      user: process.env.POOL_USER,
      password: process.env.POOL_PASSWORD,
      host: process.env.POOL_HOST,
      port: 5432,
      database: process.env.POOL_DBNAME,
    });
  
    return pool;
  };
export default getPool;