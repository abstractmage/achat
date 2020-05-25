export type SignInField = 'email' | 'password';
export type SignUpField = 'nickname' | 'email' | 'password' | 'passwordRepeat';
export type SignInFields = {
  [key in SignInField]: {
    state: 'default' | 'success' | 'error';
    value: string;
    message?: string;
  };
};

export type SignUpFields = {
  [key in SignUpField]: {
    state: 'default' | 'success' | 'error';
    value: string;
    message?: string;
  };
};

export interface IndexPageState {
  signInForm: SignInFields;
  signUpForm: SignUpFields;
}

export type SIGN_IN_FORM_INPUT = 'INDEX-PAGE/SIGN-IN-FORM-INPUT';

export interface ActionIndexPageSignInFormInputChange {
  type: SIGN_IN_FORM_INPUT;
  value: string;
  input: SignInField;
}

export type SIGN_UP_FORM_INPUT = 'INDEX-PAGE/SIGN-UP-FORM-INPUT'

export interface ActionIndexPageSignUpFormInputChange {
  type: SIGN_UP_FORM_INPUT;
  value: string;
  input: SignUpField;
}

export type SIGN_IN_FORM_VALIDATION_RESULT = 'INDEX-PAGE/SIGN-IN-FORM-VALIDATION-RESULT';

export interface ActionIndexPageSignInFormValidationResult {
  type: SIGN_IN_FORM_VALIDATION_RESULT;
  fields: SignInFields;
}

export type SIGN_UP_FORM_VALIDATION_RESULT = 'INDEX-PAGE/SIGN-UP-FORM-VALIDATION-RESULT';

export interface ActionIndexPageSignUpFormValidationResult {
  type: SIGN_UP_FORM_VALIDATION_RESULT;
  fields: SignUpFields;
}

export type SIGN_IN_CLEAR = 'INDEX-PAGE/SIGN-IN-CLEAR';

export interface ActionIndexPageSignInClear {
  type: SIGN_IN_CLEAR;
}

export type SIGN_UP_CLEAR = 'INDEX-PAGE/SIGN-UP-CLEAR';

export interface ActionIndexPageSignUpClear {
  type: SIGN_UP_CLEAR;
}

export type ActionIndexPage =
  | ActionIndexPageSignInFormInputChange
  | ActionIndexPageSignUpFormInputChange
  | ActionIndexPageSignInFormValidationResult
  | ActionIndexPageSignUpFormValidationResult
  | ActionIndexPageSignInClear
  | ActionIndexPageSignUpClear;
