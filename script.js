// Mostrar el formulario al presionar "Continuar con el correo"
document.getElementById('continuarCorreo').onclick = function () {
    document.getElementById('formOverlay').style.display = 'flex';
};

// Cerrar el formulario
function cerrarFormulario() {
    document.getElementById('formOverlay').style.display = 'none';
}

// Inicializar Google Identity Services
function handleCredentialResponse(response) {
    console.log("ID Token: ", response.credential);
    // Aquí puedes manejar el token de usuario (por ejemplo, enviarlo a tu servidor)
}

// Renderizar el botón de Google Sign-In solo cuando sea necesario
window.onload = function () {
    google.accounts.id.initialize({
        client_id: "TU_CLIENT_ID_AQUÍ.apps.googleusercontent.com",
        callback: handleCredentialResponse,
    });

    document.getElementById("googleSignInButton").onclick = function () {
        google.accounts.id.prompt(); // Muestra el selector de cuentas de Google
    };
};
