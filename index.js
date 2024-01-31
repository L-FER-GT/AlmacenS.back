const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require('bcrypt');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "fernando",
  password: "19735",
  database: "BD_AlmacenSpiaza",
  port: 3306,
});

db.connect((err) => {
  if (err) {
    console.error("Error de conexión a la base de datos: ", err);
  } else {
    console.log("Conexión exitosa a la base de datos");
  }
});

// Obtener todas las mascotas
const saltRounds = 10; // Número de rondas para la sal (puedes ajustarlo según tus necesidades)

app.get("/trabajadores", (req, res) => {
  db.query("SELECT * FROM Empleado", (err, result) => {
    if (err) {
      console.error("Error al consultar la base de datos: ", err);
      res.status(500).send("Error del servidor");
    } else {
      // Mapear los resultados y encriptar las contraseñas
      const trabajadoresEncriptados = result.map((trabajador) => {
        return {
          ...trabajador,
          Contrasena: bcrypt.hashSync(trabajador.Contrasena, saltRounds)
        };
      });

      res.status(200).json(trabajadoresEncriptados);
    }
  });
});


// // Agregar una nueva mascota
// app.post("/duenios", (req, res) => {
//   const nuevaMascota = req.body;
//   db.query("INSERT INTO dueño SET ?", nuevaMascota, (err, result) => {
//     if (err) {
//       console.error("Error al agregar un nuevo dueño: ", err);
//       res.status(500).send("Error del servidor");
//     } else {
//       res.status(201).send("Mascota agregada exitosamente");
//     }
//   });
// });


app.listen(port, () => {
  console.log(`Servidor backend en ejecución en http://localhost:${port}`);
});
