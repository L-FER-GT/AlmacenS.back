const {
  encriptarContrasena,
  DetectarPasswords,
} = require("./funciones/Encriptar");
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

//Agregar una nuevo ususario
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

//DetectarPasswords

//Agregar una nuevo ususario
app.post("/validateUser", (req, res) => {
  const loginUser = req.body;
  const { User, Password } = loginUser;
  const consulta = `select contrasena from Empleado where Usuario = '${User}'`;
  db.query(consulta, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error del servidor");
    } else {
      const claveHash = result[0].contrasena;
      DetectarPasswords(Password, claveHash)
        .then((veredict) => {
          res.status(200).send({isCorrect:veredict,idUser:''});
        })
        .catch((err) => {
          res.status(500).send("Error del servidor");
        });
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor backend en ejecución en http://localhost:${port}`);
});
