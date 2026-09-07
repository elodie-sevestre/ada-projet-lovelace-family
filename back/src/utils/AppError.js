class AppError extends Error {
  constructor(message, statusCode) {
    // passe le message au constructeur d'Error (rempli this.message)
    super(message);
    this.statusCode = statusCode;
    // facultatif mais utile pour les logs
    this.name = 'AppError';
  }
}

export default AppError;
