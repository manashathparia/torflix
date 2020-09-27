import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import {
	Movie,
	ADD_MOVIES,
	UPDATE_CURRENTLY_VIEWING,
	TOGGLE_FAVORITE_MOVIE,
} from "../Reducers/types";
import { RootState } from "../Reducers";

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

export const updateCurrentlyViewing = (movieDetails: {
	id: string;
	position?: number;
	title: string;
	magnetURI: string;
}) => ({
	type: UPDATE_CURRENTLY_VIEWING,
	payload: movieDetails,
});

export const handleFavMovies = (
	id: string
): ThunkAction<void, RootState, unknown, Action<string>> => async (
	dispatch,
	getState
) => {
	const {
		content: { favorites },
	} = getState();

	if (favorites.includes(id)) {
		const _fav = [...favorites];
		_fav.splice(_fav.indexOf(id), 1);
		dispatch(favMovieAction(_fav));
		return localStorage.setItem("favMovies", JSON.stringify(_fav));
	}
	const _fav = [...favorites, id];
	dispatch(favMovieAction(_fav));
	localStorage.setItem("favMovies", JSON.stringify(_fav));
};

const favMovieAction = (fav: Array<string>) => ({
	type: TOGGLE_FAVORITE_MOVIE,
	payload: fav,
});

export const loadFavMovies = (): ThunkAction<
	void,
	RootState,
	unknown,
	Action<string>
> => (dispatch) => {
	const favMovies = localStorage.getItem("favMovies");
	if (favMovies) {
		const _favMovies = JSON.parse(favMovies || "[]");
		dispatch(favMovieAction(_favMovies));
	}
};
