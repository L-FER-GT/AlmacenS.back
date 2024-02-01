const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require('bcrypt');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// const db = mysql.createConnection({
//   host: "127.0.0.1",
//   user: "fernando",
//   password: "19735",
//   database: "BD_AlmacenSpiaza",
//   port: 3306,
// });

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

app.get("/listUsuarios", (req, res) => {
  db.query("SELECT Usuario FROM Empleado;", (err, result) => {
    if (err) {
      console.error("Error al consultar la base de datos: ", err);
      res.status(500).send("Error del servidor");
    } else {
      // Mapear los resultados y encriptar las contraseñas

      res.status(200).json(result);
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

// const DetectarPasswords=(passwordFromUser,hashedPasswordFromDatabase)=>{
  //   bcrypt.compare(passwordFromUser, hashedPasswordFromDatabase, (err, result) => {
  //     if (err) {
  //       console.error("Error al comparar contraseñas: ", err);
  //       // Manejar el error
  //     } else {
  //       if (result) {
  //         console.log("La contraseña es válida");
  //         // Permitir el acceso
  //       } else {
  //         console.log("La contraseña no es válida");
  //         // Denegar el acceso
  //       }
  //     }
  //   });
  // }

app.listen(port, () => {
  console.log(`Servidor backend en ejecución en http://localhost:${port}`);
});
