const {
  encriptarContrasena,
  DetectarPasswords,
} = require("./funciones/Encriptar");
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const multer = require('multer');
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

//Modificar Usuario
app.post("/modUser", (req, res) => {
  const nuevosDatos = req.body;
  const {
    DocumentoIdentidad,
    Nombres,
    Apellidos,
    Cargo,
    Contacto,
    User,
    Password,
    idUser
  } = nuevosDatos;
  const setValues = {
    DocumentoIdentidad:DocumentoIdentidad,
    Nombres: Nombres,
    Apellidos: Apellidos,
    Cargo: Cargo,
    Informacion_Contacto: Contacto,
  };
  const consulta = 'UPDATE Empleado SET ? WHERE ID_Empleado = ?';
  db.query(consulta, [setValues, idUser] , (err, result) => {
    if (err) {
      res.status(500).send("Error del servidor");
    } else {
      res.status(200).send("Usuario Editado Correctamente");
    }
  });
});


//Validar la contraseña al iniciar sesion
app.post("/validateUser", (req, res) => {
  const loginUser = req.body;
  const { User, Password } = loginUser;
  const consulta = `select ID_Empleado, contrasena from Empleado where Usuario = '${User}'`;
  db.query(consulta, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error del servidor");
    } else {
      const claveHash = result[0].contrasena;
      DetectarPasswords(Password, claveHash)
        .then((veredict) => {
          res
            .status(200)
            .send({ isCorrect: veredict, idUser: result[0].ID_Empleado });
        })
        .catch((err) => {
          res.status(500).send("Error del servidor");
        });
    }
  });
});

//Validar la contraseña al iniciar sesion
app.post("/dataTrabajador", (req, res) => {
  const idTrabajador = req.body;
  const { idUser } = idTrabajador;
  const consulta = `SELECT DocumentoIdentidad, DocumentoIdentidad, Nombres, Apellidos, Cargo, Informacion_Contacto, Usuario FROM Empleado WHERE ID_Empleado = ${idUser};`;
  db.query(consulta, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error del servidor");
    } else {
      res.status(200).send(result[0]);
    }
  });
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
//GESTION DE IMAGENES
app.post('/newImage', upload.single('image'), (req, res) => {
  const { nombre } = req.body;
  const imageBuffer = req.file.buffer;

  // Aquí deberías insertar la imagen y otros datos en tu base de datos
  const sql = 'INSERT INTO Imagenes (Nombre, Image) VALUES (?, ?)';
  db.query(sql, [nombre, imageBuffer], (error, results, fields) => {
    if (error) {
      console.error('Error al insertar en la base de datos:', error);
      return res.status(500).json({ error: 'Error al insertar en la base de datos' });
    }

    res.json({ success: true, message: 'Imagen subida correctamente' });
  });
});

app.get('/getIdNamesImage', (req, res) => {
  const sql = 'SELECT ID_Image, Nombre FROM Imagenes';
  db.query(sql, (error, results, fields) => {
    if (error) {
      console.error('Error al obtener IDs y nombres de la base de datos:', error);
      return res.status(500).json({ error: 'Error al obtener IDs y nombres de la base de datos' });
    }

    res.json(results);
  });
});

app.post('/getImageById', (req, res) => {
  const { id } = req.body;

  const sql = 'SELECT Image FROM Imagenes WHERE ID_Image = ?';
  db.query(sql, [id], (error, results, fields) => {
    if (error) {
      console.error('Error al obtener la imagen de la base de datos:', error);
      return res.status(500).json({ error: 'Error al obtener la imagen de la base de datos' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Imagen no encontrada' });
    }

    const { Image } = results[0];
    res.json(Image);
  });
});


// COPNTROL DE PROVEEDORES 
app.post('/newProveedor', async (req, res) => {

  const { nombre, informacionContacto, imagenAsociada } = req.body;

  const sql = 'INSERT INTO Proveedor (Nombre, Informacion_Contacto, Imagen_Asociada) VALUES (?, ?, ?)';

  db.query(sql, [nombre, informacionContacto, imagenAsociada], (error, results, fields) => {
    if (error) {
      console.error('Error al insertar en la base de datos:', error);
      return res.status(500).json({ error: 'Error al insertar en la base de datos' });
    }

    res.status(200).json({ message: 'Proveedor agregado con éxito' });
  });
  
});












app.listen(port, () => {
  console.log(`Servidor backend en ejecución en http://localhost:${port}`);
});
