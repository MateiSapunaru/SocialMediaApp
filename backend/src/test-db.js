const mysql = require('mysql2/promise');

(async () => {
  console.log('Starting DB test...');

  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'ParolaPentruSQL151213.',
      database: 'socialmedia_app'
    });

    console.log('Connected successfully!');

    const [rows] = await connection.query('SHOW TABLES;');
    console.log('Tables in socialmedia_app:');
    console.log(rows);

    await connection.end();
    console.log('Connection closed.');
  } catch (err) {
    console.error('Connection failed:');
    console.error(err);
  }
})();
