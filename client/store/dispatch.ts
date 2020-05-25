import { useDispatch as _useDispatch } from "react-redux";

import { AppAction } from "./types";
import { Dispatch } from "redux";


const useDispatch = (): Dispatch<AppAction> => _useDispatch();

export default useDispatch;