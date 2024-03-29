// constants
export const ADD_MOVIES = "ADD_MOVIES";
export const ADD_SHOWS = "ADD_SHOWS";
export const UPDATE_CURRENTLY_VIEWING = "UPDATE_CURRENTLY_VIEWING";
export const NEXT_PAGE = "NEXT_PAGE";
export const NEXT_SEARCH_PAGE = "NEXT_SEARCH_PAGE";
export const TOGGLE_FAVORITE_MOVIE = "TOGGLE_FAVORITE_MOVIE";
export const UPDATE_SEARCH_RESULTS = "UPDATE_SEARCH_RESULTS";
export const CLEAR_SEARCH_RESULTS = "CLEAR_SEARCH_RESULTS";
export const UPDATE_SEARCH_KEYWORD = "UPDATE_SEARCH_KEYWORD";

interface ContentBase {
	_id: string;
	imdb_id: string;
	title: string;
	year: string;
	images: {
		poster: string;
		fanart: string;
		banner: string;
	};
	rating: {
		percentage: number;
		watching: number;
		votes: number;
		loved: number;
		hated: number;
	};
}
export interface Show extends ContentBase {
	tvdb_id: string;
	slug: string;
	num_seasons: number;
	synopsis: string;
	genres: string[];
	seasons: any[];
}

export interface Movie extends ContentBase {
	synopsis: string;
	runtime: string;
	released: number;
	trailer: string;
	certification: string;
	torrents: {
		[key: string]: any;
	};
	genres: Array<string>;
}

export interface MoviesState {
	moviesList: Array<Movie>;
	currentlyViewing: {
		id?: string;
		position?: number;
		title?: string;
		magnetURI?: string;
		quality?: string;
	};
	page: number;
	search: {
		searchPage: number;
		searchKeyword: string;
		searchResults: Array<Movie>;
		searchLoading: boolean;
		searchLoaded: boolean;
	};

	favorites: Array<string>;
}

export interface ShowState {
	showsList: Array<Show>;
	currentlyViewing: {
		id?: string;
		position?: number;
		title?: string;
		magnetURI?: string;
		quality?: string;
	};
	page: number;
	favorites: Array<string>;
}
