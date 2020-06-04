import { AppState } from "../types";

export const querySelector = (state: AppState) => state.usersPage.query;

export const usersPageSelector = (state: AppState) => state.usersPage;
