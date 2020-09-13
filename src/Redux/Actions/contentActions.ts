import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { Movie, ADD_MOVIES, UPDATE_CURRENTLY_VIEWING } from "../Reducers/types";

export const getMovies = (
	page: number = 1
): ThunkAction<void, null, unknown, Action<string>> => async (dispatch) => {
	try {
		const movies: Array<Movie> = await (
			await fetch(`https://torflix.vercel.app/api/movies/?page=${page}`)
		).json();

		dispatch(addMoviesAction(movies));
	} catch (error) {
		console.log(error);
	}
};

const addMoviesAction = (movies: Array<Movie>) => {
	return {
		type: ADD_MOVIES,
		payload: movies,
	};
};

export const updateCurrentlyViewing = (movie: Movie) => ({
	type: UPDATE_CURRENTLY_VIEWING,
	payload: movie,
});
