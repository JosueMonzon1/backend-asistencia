// index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const asistenciaRoutes = require('./routes/asistencia');

const app = express();
const PORT = process.env.PORT || 5500; // <-- CORREGIDO

app.use(cors());
app.use(bodyParser.json());

app.use('/api/asistencia', asistenciaRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
