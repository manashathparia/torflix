import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import {
	Movie,
	ADD_MOVIES,
	UPDATE_CURRENTLY_VIEWING,
	TOGGLE_FAVORITE_MOVIE,
	UPDATE_SEARCH_RESULTS,
	Show,
	ADD_SHOWS,
} from "../Reducers/types";
import { RootState } from "../Reducers";

export const getMovies =
	(
		page: number = 1,
		retryNo: number = 0
	): ThunkAction<void, null, unknown, Action<string>> =>
	async (dispatch) => {
		try {
			const movies: Array<Movie> = await (
				await fetch(
					`https://torflix-jswtp874x-manashathparia.vercel.app/fetch/?url=https://yrkde.link/movies/${page}/?sort=trending`
				)
			).json();

			dispatch(addMoviesAction(movies));
		} catch (error) {
			console.log(error);
			if (retryNo < 2) {
				// Sometimes the api takes more than 10sec to respond, which is beyond vercel execution time.
				//if the request fails retry it 2nd time
				dispatch(getMovies(page, retryNo + 1));
			}
		}
	};
export const searchMovies =
	(
		search: string,
		page = 1,
		retryNo: number = 0
	): ThunkAction<void, null, unknown, Action<string>> =>
	async (dispatch) => {
		try {
			let movies: Array<Movie> = await (
				await fetch(
					`https://torflix-jswtp874x-manashathparia.vercel.app/fetch/?url=https://yrkde.link/movies/${page}/?keywords=${search}&showAll=1&order=-1`
				)
			).json();
			if (movies.length === 0) {
				movies = [];
			}
			dispatch(updateMoviesSearchResultsAction(movies));
		} catch (error) {
			console.log(error);
			if (retryNo < 2) {
				// Sometimes the api takes more than 10sec to respond, which is beyond vercel execution time.
				//if the request fails retry it 2nd time
				dispatch(searchMovies(search, retryNo + 1));
			}
		}
	};

export const getShows =
	(page: number = 1): ThunkAction<void, null, unknown, Action<string>> =>
	async (dispatch) => {
		try {
			const shows: Array<Show> = await (
				await fetch(
					`https://torflix-jswtp874x-manashathparia.vercel.app/fetch/?url=https://yrkde.link/shows/${page}/?sort=trending`
				)
			).json();

			dispatch(addShowsAction(shows));
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
const updateMoviesSearchResultsAction = (movies: Array<Movie>) => {
	return {
		type: UPDATE_SEARCH_RESULTS,
		payload: movies,
	};
};
const addShowsAction = (movies: Array<Show>) => {
	return {
		type: ADD_SHOWS,
		payload: movies,
	};
};

export const updateCurrentlyViewing = (movieDetails: {
	id: string;
	position?: number;
	title: string;
	magnetURI: string;
	quality: string;
}) => ({
	type: UPDATE_CURRENTLY_VIEWING,
	payload: movieDetails,
});

export const handleFavMovies =
	(id: string): ThunkAction<void, RootState, unknown, Action<string>> =>
	async (dispatch, getState) => {
		const {
			movies: { favorites },
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

export const loadFavMovies =
	(): ThunkAction<void, RootState, unknown, Action<string>> => (dispatch) => {
		const favMovies = localStorage.getItem("favMovies");
		if (favMovies) {
			const _favMovies = JSON.parse(favMovies || "[]");
			dispatch(favMovieAction(_favMovies));
		}
	};
