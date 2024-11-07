import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'sql946.main-hosting.eu',
  user: 'u489518759_portosantos',
  password: process.env.DB_PASSWORD,
  database: 'u489518759_portosantos',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;