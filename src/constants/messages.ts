const messages = {
  auth: {
    loginSuccess: "Inicio de sesión exitoso",
    loginError: "Error al iniciar sesión. Verifica tus credenciales.",
    logoutSuccess: "Sesión cerrada correctamente",
    logoutError: "Error al cerrar sesión",
    sessionExpired: "Tu sesión ha expirado",
  },
  agenda: {
    loadError: "No pudimos cargar tu agenda",
    availabilityError: "No pudimos consultar la disponibilidad",
    requestCreated: "Solicitud enviada correctamente",
    requestError: "No pudimos crear la solicitud",
  },
  errors: {
    generic: "Ha ocurrido un error. Intenta nuevamente.",
    network: "Error de conexión. Verifica tu internet.",
    unauthorized: "Tu sesión expiró. Ingresa nuevamente.",
  },
  validation: {
    required: "Este campo es obligatorio",
    minLength: "Mínimo {0} caracteres",
  },
  toast: {
    successTitle: "Listo",
    errorTitle: "Error",
    infoTitle: "Información",
    warningTitle: "Advertencia",
  },
};

export default messages;
