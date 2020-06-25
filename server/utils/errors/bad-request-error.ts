interface BadRequestErrorOptions {
  message?: string;
}


class BadRequestError extends Error {
  statusCode = 400;
  name = 'BadRequestError';


  constructor(options?: BadRequestErrorOptions) {
    super(options?.message);
  }


  toJSON() {
    return {
      name: this.name,
      message: this.message,
    };
  }
}


export default BadRequestError;
