// Obtener el formulario de registro con correo
const form = document.getElementById('email_register_form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });

    try {
        // Realizar la solicitud POST
        const response = await fetch("http://localhost:5000/emailRegister", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formObject)
        });
        
        // Verificar si la respuesta fue exitosa
        if (response.ok) {
            // Intentar leer la respuesta como JSON
            try {
                const data = await response.json(); // Intentar obtener el JSON
                console.log('Respuesta del servidor: ', data); // Mostrar los datos

            } catch (error) {
                console.error('Error al parsear JSON:', error);
                console.log('Respuesta cruda del servidor:', await response.text());
            }
        } else {
            // Si la respuesta no es exitosa (código de estado != 2xx)
            console.error('Error en la respuesta del servidor, código:', response.status);
            const errorText = await response.text();
            console.log('Respuesta cruda del servidor:', errorText);
        }
    } catch (error) {
        // Capturar cualquier error en la solicitud
        console.error('Error en la solicitud fetch:', error);
    }
});
