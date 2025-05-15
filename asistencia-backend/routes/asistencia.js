const express = require('express');
const router = express.Router();
const db = require('../db');
const geolib = require('geolib');

// ✅ Obtener unidades
router.get('/unidades', (req, res) => {
  const query = 'SELECT id, nombre, latitud, longitud FROM unidad';
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener unidades:", err);
      return res.status(500).send("Error al obtener las unidades");
    }
    res.json(results);
  });
});

router.post('/', (req, res) => {
  const {
    dni,
    nombre,
    id_unidad,
    turno,
    tipo_registro,
    latitud,
    longitud,
    fecha_hora
  } = req.body;

  if (!dni || !nombre || !id_unidad || !turno || !tipo_registro || !latitud || !longitud || !fecha_hora) {
    return res.status(400).send("Faltan campos obligatorios");
  }

  const latNum = parseFloat(latitud);
  const lonNum = parseFloat(longitud);

  if (isNaN(latNum) || isNaN(lonNum)) {
    return res.status(400).send("Latitud o longitud inválidas");
  }

  if (isNaN(new Date(fecha_hora).getTime())) {
    return res.status(400).send("Fecha y hora inválidas");
  }

  const hoy = new Date().toISOString().split("T")[0];

  const unidadQuery = 'SELECT latitud, longitud FROM unidad WHERE id = ?';
  db.query(unidadQuery, [id_unidad], (err, unidadResults) => {
    if (err || unidadResults.length === 0) {
      console.error("Error al obtener coordenadas de la unidad:", err);
      return res.status(500).send("Error al validar ubicación");
    }

    const unidad = unidadResults[0];
    const distancia = geolib.getDistance(
      { latitude: latNum, longitude: lonNum },
      { latitude: parseFloat(unidad.latitud), longitude: parseFloat(unidad.longitud) }
    );

    const RANGO_METROS = 100;

    if (distancia > RANGO_METROS) {
      return res.status(400).send(`Estás fuera del rango permitido (${distancia}m > ${RANGO_METROS}m)`);
    }

    const checkQuery = `
      SELECT COUNT(*) AS total 
      FROM registros_asistencia 
      WHERE dni = ? AND turno = ? AND DATE(fecha_hora) = ? AND id_unidad = ?
    `;
    const checkParams = [dni, turno, hoy, id_unidad];

    db.query(checkQuery, checkParams, (err, results) => {
      if (err) {
        console.error("Error en SELECT:", err);
        return res.status(500).send("Error al verificar asistencia");
      }

      if (results[0].total > 0) {
        return res.status(400).send("Ya registraste asistencia para este turno hoy.");
      }

      const insertQuery = `
        INSERT INTO registros_asistencia 
        (dni, nombre, id_unidad, turno, tipo_registro, latitud, longitud, fecha_hora)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const insertParams = [
        dni, nombre, id_unidad, turno, tipo_registro, latNum, lonNum, fecha_hora
      ];

      db.query(insertQuery, insertParams, (err, result) => {
        if (err) {
          console.error("Error en INSERT:", err);
          return res.status(500).send("Error al registrar asistencia");
        }

        res.status(200).send("Asistencia registrada correctamente");
      });
    });
  });
});


module.exports = router;
