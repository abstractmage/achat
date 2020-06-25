interface ForbiddenErrorOptions {
  message?: string;
}


class ForbiddenError extends Error {
  statusCode = 403;
  name = 'ForbiddenError';


  constructor(options?: ForbiddenErrorOptions) {
    super(options?.message);
  }


  toJSON() {
    return {
      name: this.name,
      message: this.message,
    };
  }
}


export default ForbiddenError;
