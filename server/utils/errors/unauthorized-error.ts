interface UnauthorizedErrorOptions {
  message?: string;
}


class UnauthorizedError extends Error {
  statusCode = 401;
  name = 'UnauthorizedError';


  constructor(options?: UnauthorizedErrorOptions) {
    super(options?.message);
  }


  toJSON() {
    return {
      name: this.name,
      message: this.message,
    };
  }
}


export default UnauthorizedError;
