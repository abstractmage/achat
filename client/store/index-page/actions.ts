import {
  SignInField, SignUpField, ActionIndexPageSignInFormInputChange, ActionIndexPageSignUpFormInputChange, ActionIndexPageSignInFormValidationResult, SignInFields, SignUpFields, ActionIndexPageSignUpFormValidationResult, ActionIndexPageSignUpClear, ActionIndexPageSignInClear,
} from './types';


export const changeSignInInput = (input: SignInField, value: string): ActionIndexPageSignInFormInputChange => ({
  type: 'INDEX-PAGE/SIGN-IN-FORM-INPUT',
  input,
  value,
});

export const changeSignUpInput = (input: SignUpField, value: string): ActionIndexPageSignUpFormInputChange => ({
  type: 'INDEX-PAGE/SIGN-UP-FORM-INPUT',
  input,
  value,
});

export const setSignInValidationResult = (fields: SignInFields): ActionIndexPageSignInFormValidationResult => ({
  type: 'INDEX-PAGE/SIGN-IN-FORM-VALIDATION-RESULT',
  fields,
});

export const setSignUpValidationResult = (fields: SignUpFields): ActionIndexPageSignUpFormValidationResult => ({
  type: 'INDEX-PAGE/SIGN-UP-FORM-VALIDATION-RESULT',
  fields,
});

export const clearSignIn = (): ActionIndexPageSignInClear => ({ type: 'INDEX-PAGE/SIGN-IN-CLEAR' });

export const clearSignUp = (): ActionIndexPageSignUpClear => ({ type: 'INDEX-PAGE/SIGN-UP-CLEAR' });
