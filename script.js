// Mostrar el formulario al presionar "Continuar con el correo"
document.getElementById('continuarCorreo').onclick = function () {
    document.getElementById('formOverlay').style.display = 'flex';
};

// Cerrar el formulario
function cerrarFormulario() {
    document.getElementById('formOverlay').style.display = 'none';
}
