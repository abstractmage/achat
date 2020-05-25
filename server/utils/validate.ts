import validator from 'validator';
import _ from 'lodash';


interface ValidationData {
  [key: string]: any;
}

interface ValidationResult<TData extends ValidationData> {
  success: boolean;
  fields: {
    [key in keyof TData]: {
      value: any;
      success: boolean;
      message?: string;
    };
  };
}

type ValidationRule<TData extends ValidationData> = (value: any, data: TData) => { success: boolean; value: any; message?: string };

type ValidationRuleAsync<TData extends ValidationData> = (value: any, data: TData) => Promise<{ success: boolean; value: any; message?: string }>;

type ValidationOptions<TData extends ValidationData> = {
  [key in keyof TData]?: (ValidationRule<TData> | ValidationRuleAsync<TData>)[];
}

export const required: <TData extends ValidationData>(message?: string) => ValidationRule<TData> = (message = 'Field is required') => value => {
  if (_.isNil(value) || (typeof value === 'string' && value.length === 0)) return {
    success: false,
    value,
    message,
  };

  return { success: true, value };
};

export const email: <TData extends ValidationData>(message?: string) => ValidationRule<TData> = (message = 'Field must be a valid email') => value => {
  if (!_.isNil(value) && !validator.isEmail(value)) return {
    success: false,
    value,
    message,
  };

  return { success: true, value };
};

export const match: <TData extends ValidationData>(regex: RegExp, message?: string) => ValidationRule<TData> = (
  regex,
  message = 'Field is invalid',
) => value => {
  if (!_.isNil(value) && !validator.matches(value, regex)) return {
    success: false,
    value,
    message,
  };

  return { success: true, value };
};

export const string: <TData extends ValidationData>(message?: string) => ValidationRule<TData> = (
  message = 'Field must be a string',
) => value => {
  if (!_.isNil(value) && !_.isString(value)) return {
    success: false,
    value,
    message,
  };

  return { success: true, value };
};

type ValidateFunc = <TData extends ValidationData>(
  data: TData,
  options: ValidationOptions<TData>,
  onlyErrors?: boolean,
) => Promise<ValidationResult<TData>>;

const validate: ValidateFunc = async <TData extends ValidationData>(
  data: TData,
  options: ValidationOptions<TData>,
  onlyErrors: boolean = false,
) => {
  const result: any = {
    success: true,
    fields: {},
  };

  const optionsArr = Object.entries(options);

  for (let [key, rules] of optionsArr) {
    const value = data[key];

    for (let rule of (rules as (ValidationRule<TData> | ValidationRuleAsync<TData>)[])) {
      const ruleResult = await rule(value, data);

      if (!ruleResult.success) {
        result.success = false;
        result.fields[key] = {
          success: false,
          value: typeof value === 'undefined' ? null : value,
          message: ruleResult.message,
        };
        break;
      } else if (!onlyErrors) {
        result.fields[key] = {
          success: true,
          value: typeof value === 'undefined' ? null : value,
        };
      }
    }
  }

  return result;
};


export default validate;
