import { useSelector } from 'react-redux';

import { AppState } from '../types';


export const signInSelector = (state: AppState) => ({
  ...state.indexPage.signInForm,
});

export const useSignInSelector = () => useSelector(signInSelector);
