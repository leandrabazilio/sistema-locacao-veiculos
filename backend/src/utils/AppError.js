export default class AppError extends Error {
  constructor(mensagem, statusCode = 400) {
    super(mensagem);
    this.name = "AppError";
    this.statusCode = statusCode;
  }
}
