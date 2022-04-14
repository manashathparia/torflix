import { combineReducers } from "redux";
import movies from "./moviesReducer";
import shows from "./showReducer";

export const rootReducer = combineReducers({
	movies,
	shows,
});

export type RootState = ReturnType<typeof rootReducer>;
