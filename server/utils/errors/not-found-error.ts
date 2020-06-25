interface NotFoundErrorOptions {
  message?: string;
}


class NotFoundError extends Error {
  statusCode = 404;
  name = 'NotFoundError';


  constructor(options?: NotFoundErrorOptions) {
    super(options?.message);
  }


  toJSON() {
    return {
      name: this.name,
      message: this.message,
    };
  }
}


export default NotFoundError;
