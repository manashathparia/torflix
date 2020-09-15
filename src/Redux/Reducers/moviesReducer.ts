import {
	MoviesState,
	Movie,
	ADD_MOVIES,
	UPDATE_CURRENTLY_VIEWING,
	NEXT_PAGE,
} from "./types";

const initial: MoviesState = {
	movies: [],
	currentlyViewing: {},
	page: 1,
};

export default function moviesReducer(
	state = initial,
	{ type, payload }: { type: string; payload: Movie | Array<Movie> }
): MoviesState {
	switch (type) {
		case ADD_MOVIES:
			return { ...state, movies: [...state.movies, ...payload] };

		case UPDATE_CURRENTLY_VIEWING:
			return { ...state, currentlyViewing: payload };

		case NEXT_PAGE:
			return { ...state, page: state.page + 1 };

		default:
			return state;
	}
}
