// recuperar.js
// Permite actualizar la contraseña (misma validación que en registro).
// Al actualziar:
// - se desbloquea la cuenta (bloqueado = 0)
// - se reinician intentos (intentos = 0)
// - muestra mensaje de éxito

var passwordRegex = /^(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

document.getElementById('mostrarNewPass').addEventListener('change', function() {
  var p = document.getElementById('newPassword');
  if (this.checked) p.type = 'text'; else p.type = 'password';
});

function obtenerUsuarios() {
  var u = localStorage.getItem('usuarios');
  if (!u) {
    var seed = [
      { nombreCompleto: "Usuario Ejemplo", email: "ejemplo@dominio.com", celular: "+59171234567", password: "Ejemplo@123", intentos: 0, bloqueado: 0 }
    ];
    localStorage.setItem('usuarios', JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(u);
}
function guardarUsuarios(u) { localStorage.setItem('usuarios', JSON.stringify(u)); }

document.getElementById('formRecuperar').addEventListener('submit', function(event) {
  event.preventDefault();
  var emailRecupError = document.getElementById('emailRecupError');
  var newPassError = document.getElementById('newPassError');
  var recupMensaje = document.getElementById('recupMensaje');

  emailRecupError.textContent = '';
  newPassError.textContent = '';
  recupMensaje.textContent = '';

  var email = document.getElementById('emailRecup').value.trim();
  var np = document.getElementById('newPassword').value;

  if (email === '') {
    emailRecupError.textContent = 'Ingrese su correo registrado.';
    return;
  }
  if (np === '' || !passwordRegex.test(np) || np === '1234') {
    newPassError.textContent = 'Contraseña inválida. Debe tener al menos 8 caracteres, una mayúscula y un carácter especial. No use "1234".';
    return;
  }

  var usuarios = obtenerUsuarios();
  var idx = -1;
  for (var i = 0; i < usuarios.length; i++) {
    if (usuarios[i].email.toLowerCase() === email.toLowerCase()) { idx = i; break; }
  }
  if (idx < 0) {
    emailRecupError.textContent = 'No existe una cuenta con ese correo.';
    return;
  }

  usuarios[idx].password = np;
  usuarios[idx].bloqueado = 0;
  usuarios[idx].intentos = 0;
  guardarUsuarios(usuarios);

  recupMensaje.textContent = 'Contraseña actualizada. Ahora puede iniciar sesión.';
  recupMensaje.className = 'success';
  document.getElementById('formRecuperar').reset();
});
