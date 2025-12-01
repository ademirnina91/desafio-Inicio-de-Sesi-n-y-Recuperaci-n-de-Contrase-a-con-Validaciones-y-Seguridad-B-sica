// login.js
// Manejo de inicio de sesión con bloqueo tras 3 intentos fallidos.
// Campos en usuario: intentos (contador) y bloqueado (0 o 1).

// Mostrar/ocultar contraseña
document.getElementById('mostrarPassLogin').addEventListener('change', function() {
  var p = document.getElementById('passwordLogin');
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

function buscarUsuarioPorEmail(email) {
  var usuarios = obtenerUsuarios();
  for (var i = 0; i < usuarios.length; i++) {
    if (usuarios[i].email.toLowerCase() === email.toLowerCase()) return i;
  }
  return -1;
}

document.getElementById('formLogin').addEventListener('submit', function(event) {
  event.preventDefault();

  var loginError = document.getElementById('loginError');
  var loginMensaje = document.getElementById('loginMensaje');
  var linkRecuperar = document.getElementById('linkRecuperar');

  loginError.textContent = '';
  loginMensaje.textContent = '';

  var email = document.getElementById('emailLogin').value.trim();
  var password = document.getElementById('passwordLogin').value;

  if (email === '' || password === '') {
    loginError.textContent = 'Complete ambos campos.';
    return;
  }

  var idx = buscarUsuarioPorEmail(email);
  if (idx < 0) {
    loginError.textContent = 'Usuario o contraseña incorrectos.';
    return;
  }

  var usuarios = obtenerUsuarios();
  var u = usuarios[idx];

  // Si cuenta bloqueada
  if (u.bloqueado === 1) {
    loginError.textContent = 'Cuenta bloqueada por intentos fallidos.';
    linkRecuperar.style.display = 'inline';
    return;
  }

  if (u.password === password) {
    // Éxito: resetear intentos
    u.intentos = 0;
    guardarUsuarios(usuarios);
    loginMensaje.textContent = 'Bienvenido al sistema, ' + u.nombreCompleto + '.';
    loginMensaje.className = 'success';
    linkRecuperar.style.display = 'none';
  } else {
    // Error: incrementar intentos
    u.intentos = (u.intentos || 0) + 1;
    var intentosRestantes = 3 - u.intentos;
    if (u.intentos >= 3) {
      u.bloqueado = 1;
      guardarUsuarios(usuarios);
      loginError.textContent = 'Cuenta bloqueada por intentos fallidos.';
      linkRecuperar.style.display = 'inline';
    } else {
      guardarUsuarios(usuarios);
      loginError.textContent = 'Usuario o contraseña incorrectos. Intentos restantes: ' + intentosRestantes;
    }
  }
});
