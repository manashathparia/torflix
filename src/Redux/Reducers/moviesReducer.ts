import {
	MoviesState,
	Movie,
	ADD_MOVIES,
	UPDATE_CURRENTLY_VIEWING,
	NEXT_PAGE,
	NEXT_SEARCH_PAGE,
	TOGGLE_FAVORITE_MOVIE,
	UPDATE_SEARCH_RESULTS,
	UPDATE_SEARCH_KEYWORD,
	CLEAR_SEARCH_RESULTS,
} from "./types";

const initial: MoviesState = {
	moviesList: [],
	currentlyViewing: {},
	page: 1,
	favorites: [],
	search: {
		searchPage: 1,
		searchKeyword: "",
		searchLoaded: false,
		searchLoading: false,
		searchResults: [],
	},
};

type Payload =
	| Movie
	| Array<Movie>
	| string[]
	| { url?: string; position?: number };

export default function moviesReducer(
	state = initial,
	{ type, payload }: { type: string; payload: Payload }
): MoviesState {
	switch (type) {
		case ADD_MOVIES:
			return {
				...state,
				moviesList: [...state.moviesList, ...(payload as Array<Movie>)],
			};

		case UPDATE_CURRENTLY_VIEWING:
			return { ...state, currentlyViewing: payload as {} };

		case UPDATE_SEARCH_RESULTS:
			return {
				...state,
				search: {
					...state.search,
					searchResults: [
						...state.search.searchResults,
						...(payload as Array<Movie>),
					],
					searchLoaded: true,
				},
			};

		case NEXT_PAGE:
			return { ...state, page: state.page + 1 };

		case NEXT_SEARCH_PAGE:
			return { ...state, page: state.page + 1 };

		case TOGGLE_FAVORITE_MOVIE:
			return { ...state, favorites: [...(payload as Array<string>)] };

		case UPDATE_SEARCH_KEYWORD:
			return {
				...state,
				search: { ...state.search, searchKeyword: payload as string },
			};

		case CLEAR_SEARCH_RESULTS:
			return { ...state, search: initial.search };

		default:
			return state;
	}
}
