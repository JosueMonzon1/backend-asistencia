// db.js
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',      
  password: 'amazonsecurity',      
  database: 'asistencia_db'
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Error al conectar a MySQL:', err);
    return;
  }
  console.log('✅ Conectado a la base de datos MySQL.');
});

module.exports = connection;
