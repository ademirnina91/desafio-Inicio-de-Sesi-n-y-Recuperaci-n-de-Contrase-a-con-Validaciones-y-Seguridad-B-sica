// registro.js
// Lógica simple para registro usando localStorage como "base de datos".
// Reglas:
// - Campos obligatorios: nombre, email, celular, password
// - Validaciones por regex (explicadas abajo)
// - No permitir contraseña "1234"
// - Guardar usuario con campos: nombreCompleto, email, celular, password, intentos, bloqueado

// Expresiones regulares usadas:
// emailRegex: valida formato general de correo (usuario@dominio.tld)
var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// nombreRegex: solo letras (incluye acentos y ñ) y espacios
var nombreRegex = /^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$/;
// passwordRegex: al menos 8 caracteres, al menos una mayúscula y al menos un carácter no alfanumérico
var passwordRegex = /^(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
// celularRegex: acepta +591 opcional o sin prefijo; 8 dígitos que empiezan con 6 o 7
var celularRegex = /^(\+591)?[67][0-9]{7}$/;

function obtenerUsuarios() {
  var u = localStorage.getItem('usuarios');
  if (!u) {
    // Inicializamos sin archivo .json (según petición)
    var seed = [
      {
        nombreCompleto: "Usuario Ejemplo",
        email: "ejemplo@dominio.com",
        celular: "+59171234567",
        password: "Ejemplo@123",
        intentos: 0,
        bloqueado: 0
      }
    ];
    localStorage.setItem('usuarios', JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(u);
}

function guardarUsuarios(u) {
  localStorage.setItem('usuarios', JSON.stringify(u));
}

function buscarUsuarioPorEmail(email) {
  var usuarios = obtenerUsuarios();
  for (var i = 0; i < usuarios.length; i++) {
    if (usuarios[i].email.toLowerCase() === email.toLowerCase()) return i;
  }
  return -1;
}

// Mostrar/ocultar contraseña simple (checkbox)
document.getElementById('mostrarPass').addEventListener('change', function() {
  var p = document.getElementById('password');
  if (this.checked) p.type = 'text'; else p.type = 'password';
});

document.getElementById('formRegistro').addEventListener('submit', function(event) {
  event.preventDefault();

  var nombre = document.getElementById('nombre').value.trim();
  var email = document.getElementById('email').value.trim();
  var celular = document.getElementById('celular').value.trim();
  var password = document.getElementById('password').value;

  var nombreError = document.getElementById('nombreError');
  var emailError = document.getElementById('emailError');
  var celularError = document.getElementById('celularError');
  var passwordError = document.getElementById('passwordError');
  var mensaje = document.getElementById('mensaje');

  // Limpiar mensajes
  nombreError.textContent = '';
  emailError.textContent = '';
  celularError.textContent = '';
  passwordError.textContent = '';
  mensaje.textContent = '';

  // Validaciones con regex
  if (nombre === '' || !nombreRegex.test(nombre)) {
    nombreError.textContent = 'Nombre inválido. Solo letras y espacios.';
    return;
  }

  if (email === '' || !emailRegex.test(email)) {
    emailError.textContent = 'Correo inválido.';
    return;
  }

  if (celular === '' || !celularRegex.test(celular)) {
    celularError.textContent = 'Número inválido. Debe ser +591 seguido de 8 dígitos que empiecen con 6 o 7, o solo 8 dígitos que empiecen con 6 o 7.';
    return;
  }

  if (password === '' || !passwordRegex.test(password)) {
    if (password === '1234') {
      passwordError.textContent = 'Contraseña no permitida.';
    } else {
      passwordError.textContent = 'La contraseña debe tener al menos 8 caracteres, una mayúscula y un carácter especial.';
    }
    return;
  }

  // Verificar existencia
  var idx = buscarUsuarioPorEmail(email);
  if (idx >= 0) {
    emailError.textContent = 'Ya existe una cuenta con ese correo.';
    return;
  }

  // Guardar usuario
  var usuarios = obtenerUsuarios();
  usuarios.push({
    nombreCompleto: nombre,
    email: email,
    celular: celular,
    password: password,
    intentos: 0,
    bloqueado: 0
  });
  guardarUsuarios(usuarios);

  mensaje.textContent = '¡Registro exitoso! Ahora puede iniciar sesión.';
  mensaje.className = 'success';
  document.getElementById('formRegistro').reset();
});
