import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { MoviesState, ADD_MOVIES } from "../Reducers/moviesReducer";

export const getMovies = (
	page: number = 1
): ThunkAction<void, null, unknown, Action<string>> => async (dispatch) => {
	try {
		const movies: Array<MoviesState> = await (
			await fetch(`https://movies-v2.api-fetch.sh/movies/${page}`)
		).json();

		dispatch(addMoviesAction(movies));
	} catch (error) {
		console.log(error);
	}
};

const addMoviesAction = (
	movies: Array<MoviesState>
): { type: string; payload: Array<MoviesState> } => {
	return {
		type: ADD_MOVIES,
		payload: movies,
	};
};
