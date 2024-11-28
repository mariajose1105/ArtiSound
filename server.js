const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt'); // Para encriptar contraseñas
const dotenv = require('dotenv'); // Para cargar variables de entorno
const cors = require('cors')

dotenv.config(); // Cargar archivo .env

const app = express();
const PORT = process.env.PORT || 5000;


// URI de MongoDB
const MONGO_URI = process.env.MONGO_URI; 

// Middleware para procesar datos JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS options
const corsOptions = {
    origin: '*',
    methods: 'POST',
    allowedHeaders: 'Content-Type, Authorization'
}

// Habilitar CORS para todas las solicitudes
app.use(cors(corsOptions));

// Conexión a MongoDB
let db;
let users;
MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
    .then(client => {
        console.log('Conectado a MongoDB');
        db = client.db('ArtiSound'); // Base de datos llamada "ArtiSound"
        users = db.collection('users');
    })
    .catch(error => console.error('Error al conectar a MongoDB:', error));

// Encriptacion y Comparacion de Pwds
async function encryptPwd(plainTextPassword) {
    try {
        let hashedPassword = await bcrypt.hash(plainTextPassword, 10);
        return hashedPassword;
    } catch (err) {
        console.error("Error al encriptar la contraseña: ", err);
    }
}

async function comparePwd(plainTextPassword, hashedPassword) {
    try {
        let result = await bcrypt.compare(plainTextPassword, hashedPassword);
        return result;
    } catch (error) {
        console.error("Error al verificar la contraseña: ", error)
    }
}

// Ruta para inicio de sesión
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    console.log('Datos recibidos para iniciar sesión:', { email, password });

    if (!email || !password) {
        return res.status(400).json({ error: 'Por favor, ingresa tu correo y contraseña' });
    }

    try {
        // Busca al usuario en la base de datos
        const user = await db.collection('users').findOne({ email: email });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Compara la contraseña ingresada con la almacenada
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Inicio de sesión exitoso
        res.status(200).json({ message: 'Inicio de sesión exitoso' });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


// Ruta para inicio de sesión
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    // Verifica que los datos lleguen correctamente al servidor
    console.log('Datos recibidos para iniciar sesión:', { email, password });

    if (!email || !password) {
        return res.status(400).send('Por favor, ingresa tu correo y contraseña');
    }

    // Busca al usuario en la base de datos
    db.collection('users').findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.status(404).send('Usuario no encontrado');
            }
            // Compara la contraseña (en texto plano)
            if (user.password !== password) {
                return res.status(401).send('Contraseña incorrecta');
            }
            res.status(200).send('Inicio de sesión exitoso');
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Error al iniciar sesión');
        });
});


// Ruta para registro con email
app.post('/emailRegister', async (req, res) => {
    const { email, firstName, lastName, password, phone } = req.body;

    if (!email || !firstName || !lastName || !password || !phone) {
        return res.status(400).send('Por favor, ingresa los datos requeridos');
    }
    try {
        const user = await users.findOne({ email: email });
        if (user) {
            return res.status(400).send({ 'response': 'Usuario ya registrado.' });
        }
        // Hash de la contraseña
        let hashedPwd = await encryptPwd(password);
        // Inserción en la base de datos
        const result = await users.insertOne({
            email: email,
            password: hashedPwd 
        });

        // Respuesta de éxito
        res.status(201).send({
            'id': result.insertedId
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al realizar el registro');
    }
});


// Iniciar el servidor
// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

