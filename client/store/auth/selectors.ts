import { AppState } from "../types";

export const userSelector = (state: AppState) => state.auth.user;
