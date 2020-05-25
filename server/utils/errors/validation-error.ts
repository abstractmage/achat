type ValidationErrorItems = {
  [key: string]: {
    value: any;
    message: string;
  };
};

interface ValidationErrorOptions {
  message?: string;
  errors: ValidationErrorItems;
}

class ValidationError extends Error {
  statusCode = 400;
  name = 'ValidationError';
  errors!: ValidationErrorItems;


  constructor(options: ValidationErrorOptions) {
    super(options.message);

    this.errors = options.errors;
  }


  toJSON() {
    return {
      name: this.name,
      errors: this.errors,
      message: this.message,
    };
  }
}


export default ValidationError;
