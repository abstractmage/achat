import { AppState } from "./types";


export const userSelector = (state: AppState) => ({
  user: state.user,
});