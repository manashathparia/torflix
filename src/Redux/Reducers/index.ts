import { combineReducers } from "redux";
import movies from "./moviesReducer";

export const rootReducer = combineReducers({
	content: movies,
});

export type RootState = ReturnType<typeof rootReducer>;
