import { IndexPageState, ActionIndexPage } from "./types";


const defaultState: IndexPageState = {
  signInForm: {
    email: {
      state: 'default',
      value: '',
    },
    password: {
      state: 'default',
      value: '',
    },
  },
  signUpForm: {
    nickname: {
      state: 'default',
      value: '',
    },
    email: {
      state: 'default',
      value: '',
    },
    password: {
      state: 'default',
      value: '',
    },
    passwordRepeat: {
      state: 'default',
      value: '',
    },
  },
};

export default (state: IndexPageState = defaultState, action: ActionIndexPage): IndexPageState => {
  switch (action.type) {
    case 'INDEX-PAGE/SIGN-IN-FORM-INPUT': return {
      ...state,
      signInForm: {
        ...state.signInForm,
        [action.input]: {
          ...state.signInForm[action.input],
          value: action.value,
        },
      },
    };
    case 'INDEX-PAGE/SIGN-UP-FORM-INPUT': return {
      ...state,
      signInForm: {
        ...state.signUpForm,
        [action.input]: {
          ...state.signUpForm[action.input],
          value: action.value,
        },
      },
    };
    case 'INDEX-PAGE/SIGN-IN-FORM-VALIDATION-RESULT': return {
      ...state,
      signInForm: {
        ...action.fields,
      },
    };
    case 'INDEX-PAGE/SIGN-UP-FORM-VALIDATION-RESULT': return {
      ...state,
      signUpForm: {
        ...action.fields,
      },
    };
    case 'INDEX-PAGE/SIGN-IN-CLEAR': return {
      ...state,
      signInForm: {
        ...defaultState.signInForm,
      },
    };
    case 'INDEX-PAGE/SIGN-UP-CLEAR': return {
      ...state,
      signUpForm: {
        ...defaultState.signUpForm,
      },
    };
    default: return state;
  }
};
