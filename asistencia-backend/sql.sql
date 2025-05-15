CREATE DATABASE IF NOT EXISTS asistencia_db;
USE asistencia_db;

CREATE TABLE IF NOT EXISTS registros_asistencia (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dni VARCHAR(8) NOT NULL,
  nombre VARCHAR(100),
  id_unidad int,
  turno VARCHAR(20),
  tipo_registro VARCHAR(20),
  latitud DECIMAL(10, 6),
  longitud DECIMAL(10, 6),
  fecha_hora DATETIME NOT NULL
);

CREATE TABLE unidad (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  latitud DECIMAL(10, 8),
  longitud DECIMAL(11, 8)
);

INSERT INTO unidad (nombre, latitud, longitud) VALUES
('Tarapoto - ESSALUD', -6.490615, -76.376497),
('Tarapoto - Oficina', -6.487532, -76.352864),
('Tarapoto - OSINFOR', -6.502313, -76.368257);

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'amazonsecurity';
FLUSH PRIVILEGES;

DESCRIBE registros_asistencia;

select * from asistencia_db.unidad;
select * from asistencia_db.registros_asistencia;