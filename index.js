const { encriptarContrasena } = require("./funciones/Encriptar");
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// const db = mysql.createConnection({
//   host: "127.0.0.1",
//   user: "Alvaro",
//   password: "Alvaro02004221",
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
      res.status(200).json(result);
    }
  });
});

// // Agregar una nueva mascota
app.post("/newUser", (req, res) => {
  const nuevoUsuario = req.body;
  const {
    DocumentoIdentidad,
    Nombres,
    Apellidos,
    Cargo,
    Contacto,
    User,
    Password,
  } = nuevoUsuario;

  encriptarContrasena(Password)
    .then((hash) => {
      const consulta = `INSERT INTO Empleado (DocumentoIdentidad, Nombres, Apellidos, Cargo, Informacion_Contacto, Usuario, Contrasena)
  VALUES ('${DocumentoIdentidad}', '${Nombres}', '${Apellidos}', '${Cargo}', '${Contacto}', '${User}', '${hash}');`;
      db.query(consulta, (err, result) => {
        if (err) {
          console.error("Error al agregar un nuevo dueño: ", err);
          res.status(500).send("Error del servidor");
        } else {
          res.status(200).send("Usuario Agregado Correctamente");
        }
      });
    })
    .catch((error) =>
      console.error("Error al encriptar la contraseña:", error)
    );
});

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
