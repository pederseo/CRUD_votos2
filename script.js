document.addEventListener('DOMContentLoaded', () => {
    const formCargar = document.querySelector('#form-cargar');
    const botonSubmit = document.querySelector('#boton-submit');
    const tablaParticipantes = document.querySelector('#tabla-participantes tbody');
    let currentId = null; // Variable para almacenar el ID del participante que se está editando

//____________________________________________________________________________
    formCargar.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nombre = document.querySelector('#nombre').value;
        const disfraz = document.querySelector('#disfraz').value;

        try {
            let response;

            // solicitud a la ruta actualizar
            if (currentId) {
                response = await fetch('/actualizar', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: currentId, nombre, disfraz }),
                });
            // solicitud a la ruta cargar
            } else {
                response = await fetch('/cargar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ nombre, disfraz }),
                });
            }

            const participantes = await response.json();
            actualizarTabla(participantes);
            formCargar.reset(); // Limpiar el formulario
            currentId = null; // Reiniciar el ID actual
            botonSubmit.textContent = 'Cargar'; // Cambiar el texto del botón
        } catch (error) {
            console.error('Error al cargar/actualizar el participante:', error);
        }
    });

//____________________________________________________________________________

    function actualizarTabla(participantes) {
        // Ordenar participantes de mayor a menor
        participantes.sort((a, b) => b.votos - a.votos);

        tablaParticipantes.innerHTML = ''; // Limpiar la tabla
        participantes.forEach((participante) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${participante.nombre}</td>
                <td>${participante.disfraz}</td>
                <td>${participante.votos}</td>
                <td><button onclick="votar(${participante.id})">Votar</button></td>
                <td><button onclick="editar(${participante.id}, '${participante.nombre}', '${participante.disfraz}')">Editar</button></td>
                <td><button onclick="eliminar(${participante.id})">Eliminar</button></td>
            `;
            tablaParticipantes.appendChild(row);
        });
    }

//____________________________________________________________________________

    // 
    window.votar = async (id) => {
        try {
            const response = await fetch('/votar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            const participantes = await response.json();
            actualizarTabla(participantes);
        } catch (error) {
            console.error('Error al votar:', error);
        }
    };

    // Función para editar un participante
    window.editar = (id, nombre, disfraz) => {
        currentId = id; // Guardar el ID del participante que se está editando
        document.querySelector('#nombre').value = nombre; // Rellenar el campo de nombre
        document.querySelector('#disfraz').value = disfraz; // Rellenar el campo de disfraz
        botonSubmit.textContent = 'Actualizar'; // Cambiar el texto del botón a "Actualizar"
    };

    // Función para eliminar un participante
    window.eliminar = async (id) => {
        const confirmDelete = confirm('¿Estás seguro de que quieres eliminar este participante?');
        if (confirmDelete) {
            try {
                const response = await fetch(`/eliminar/${id}`, {
                    method: 'DELETE',
                });

                const participantes = await response.json();
                actualizarTabla(participantes);
            } catch (error) {
                console.error('Error al eliminar el participante:', error);
            }
        }
    };
});
