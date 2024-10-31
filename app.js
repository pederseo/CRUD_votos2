const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// instanciar
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Para servir archivos estáticos como scripts.js
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname));

// base de datos
let db_participantes = { participantes: [] };

//__________________________________________________________________________________
// Ruta index
app.get('/', (req, res) => {
    res.render('index');
});


//__________________________________________________________________________________
// Ruta para cargar un nuevo participante
app.post('/cargar', (req, res) => {
    const { nombre, disfraz } = req.body;
    if (nombre && disfraz) {
        const nuevoParticipante = {
            id: db_participantes.participantes.length + 1,
            nombre,
            disfraz,
            votos: 0,
        };
        db_participantes.participantes.push(nuevoParticipante);
        res.json(db_participantes.participantes); // Devuelve la lista actualizada
    } else {
        res.status(400).json({ error: 'Faltan datos' });
    }
});


//__________________________________________________________________________________
// Ruta para votar por un participante
app.post('/votar', (req, res) => {
    const { id } = req.body;
    const participante = db_participantes.participantes.find(p => p.id === id);
    if (participante) {
        participante.votos += 1;
        res.json(db_participantes.participantes); // Devuelve la lista actualizada
    } else {
        res.status(404).json({ error: 'Participante no encontrado' });
    }
});


//__________________________________________________________________________________
// Ruta para obtener la lista de participantes
app.get('/participantes', (req, res) => {
    res.json(db_participantes.participantes);
});

// Ruta para actualizar un participante
app.put('/actualizar', (req, res) => {
    const { id, nombre, disfraz } = req.body;

    // Encontrar el índice del participante en el arreglo
    const index = db_participantes.participantes.findIndex(p => p.id === id);
    
    if (index !== -1) {
        // Actualizar los datos del participante
        db_participantes.participantes[index] = { id, nombre, disfraz, votos: db_participantes.participantes[index].votos };
        return res.json(db_participantes.participantes); // Devuelve la lista actualizada
    }
    return res.status(404).json({ message: 'Participante no encontrado' });
});

//__________________________________________________________________________________
// Ruta para eliminar un participante
app.delete('/eliminar/:id', (req, res) => {
    const { id } = req.params; // Obtener el ID del participante a eliminar
    const index = db_participantes.participantes.findIndex(p => p.id === parseInt(id));

    if (index !== -1) {
        db_participantes.participantes.splice(index, 1); // Eliminar el participante del arreglo
        return res.json(db_participantes.participantes); // Devuelve la lista actualizada
    }
    return res.status(404).json({ message: 'Participante no encontrado' });
});

//__________________________________________________________________________________
// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
