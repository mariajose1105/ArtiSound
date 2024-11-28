// Obtener el formulario de registro con correo
const form = document.getElementById('email_register_form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });

    let dataReponse;
    await fetch("http://localhost:5000/emailRegister", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formObject)
    })
    .then(response => {
        dataResponse =  response.json()
        console.log(dataReponse)
    })
    .then(data => {
        console.log('Respuesta del servidor: ', data)
    })
});
