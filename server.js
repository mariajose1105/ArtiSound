const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt'); // Para encriptar contraseñas
const dotenv = require('dotenv'); // Para cargar variables de entorno

dotenv.config(); // Cargar archivo .env

const app = express();
const PORT = process.env.PORT || 5000;


// URI de MongoDB
const MONGO_URI = process.env.MONGO_URI; 

// Middleware para procesar datos JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a MongoDB
let db;
MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
    .then(client => {
        console.log('Conectado a MongoDB');
        db = client.db('ArtiSound'); // Base de datos llamada "ArtiSound"
    })
    .catch(error => console.error('Error al conectar a MongoDB:', error));

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
app.post('/login', (req, res) => {
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


// Iniciar el servidor
// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

