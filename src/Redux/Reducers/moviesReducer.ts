import {
	MoviesState,
	Movie,
	ADD_MOVIES,
	UPDATE_CURRENTLY_VIEWING,
	NEXT_PAGE,
	TOGGLE_FAVORITE_MOVIE,
} from "./types";

const initial: MoviesState = {
	movies: [],
	currentlyViewing: {},
	page: 1,
	favorites: [],
};

export default function moviesReducer(
	state = initial,
	{ type, payload }: { type: string; payload: Movie | Array<Movie> | string[] }
): MoviesState {
	switch (type) {
		case ADD_MOVIES:
			return {
				...state,
				movies: [...state.movies, ...(payload as Array<Movie>)],
			};

		case UPDATE_CURRENTLY_VIEWING:
			return { ...state, currentlyViewing: payload as Movie };

		case NEXT_PAGE:
			return { ...state, page: state.page + 1 };

		case TOGGLE_FAVORITE_MOVIE:
			return { ...state, favorites: [...(payload as Array<string>)] };

		default:
			return state;
	}
}
