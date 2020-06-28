import { observable, action } from 'mobx';
import _ from 'lodash';
import validate, { email as emailRule, required, match } from '~/utils/validate';
import api, { SignInValidationError } from '~/utils/api';
import User from '~/types/user';

interface IndexPageModal<T extends string> {
  opened: boolean;
  form: {
    [key in T]: {
      value: string;
      state: 'default' | 'success' | 'error';
    };
  };
}

type SignInModal = IndexPageModal<'email' | 'password'>;
type SignUpModal = IndexPageModal<'email' | 'nickname' | 'password' | 'passwordRepeat'>;

class IndexPageStore {
  @observable signInModal: SignInModal = {
    opened: false,
    form: {
      email: { value: '', state: 'default' },
      password: { value: '', state: 'default' },
    },
  };

  @observable signUpModal: SignUpModal = {
    opened: false,
    form: {
      email: { value: '', state: 'default' },
      nickname: { value: '', state: 'default' },
      password: { value: '', state: 'default' },
      passwordRepeat: { value: '', state: 'default' },
    },
  };

  @action toggleSignIn = (val: boolean = !this.signInModal.opened) => {
    this.signInModal.opened = val;
    this.signUpModal.opened = !val;

    if (val) _.values(this.signInModal.form).forEach(field => {
      field.state = 'default';
      field.value = '';
    });
  }

  @action toggleSignUp = (val: boolean = !this.signUpModal.opened) => {
    this.signUpModal.opened = val;
    this.signInModal.opened = !val;

    if (val) _.values(this.signUpModal.form).forEach(field => {
      field.state = 'default';
      field.value = '';
    });
  }

  @action closeModals = () => {
    this.signInModal.opened = false;
    this.signUpModal.opened = false;
  }

  @action changeValue = <T extends 'sign-in' | 'sign-up'>(
    form: T,
    field: T extends 'sign-in' ? 'email' | 'password' : 'email' | 'nickname' | 'password' | 'passwordRepeat',
    value: string,
  ) => {
    if (form === 'sign-in') {
      this.signInModal.form[field as 'email' | 'password'].value = value;
      this.signInModal.form[field as 'email' | 'password'].state = 'default';
    } else {
      this.signUpModal.form[field as 'email' | 'nickname' | 'password' | 'passwordRepeat'].value = value;
      this.signUpModal.form[field as 'email' | 'nickname' | 'password' | 'passwordRepeat'].state = 'default';
    }
  }

  @action submit = async (cb: (user: User) => void) => {
    const { email: { value: email }, password: { value: password } } = this.signInModal.form;

    const validationResult = await validate({ email, password }, {
      email: [required(), emailRule()],
      // eslint-disable-next-line no-useless-escape
      password: [required(), match(/[a-zA-Z0-9!@#\$%\^&\*\./]{6,}/g)],
    });

    _.entries(validationResult.fields).forEach(([field, value]) => {
      this.signInModal.form[field as 'email' | 'password'].state = value.success ? 'success' : 'error';
    });

    if (!validationResult.success) return;
    
    try {
      const { data: { user } } = await api.signIn(email, password);
      this.closeModals();
      cb(user);
    } catch (err) {
      const error: SignInValidationError = err;

      if (error.response) {
        const errorFields = _.fromPairs(
          _.toPairs(error.response.data.errors)
            .filter(pair => ['email', 'password'].includes(pair[0]) && !!pair[1].message)
            .map(pair => ([pair[0], { value: pair[1].value, state: 'error', message: pair[1].message }]))
        );

        this.signInModal.form = {
          email: {
            value: email,
            state: 'success',
          },
          password: {
            value: password,
            state: 'success',
          },
          ...errorFields,
        };
      }
    }
  }

  hydrate(store: IndexPageStore) {
    // console.log(store);
  }
}

export default IndexPageStore;