// constants
export const ADD_MOVIES = "ADD_MOVIES";
export const UPDATE_CURRENTLY_VIEWING = "UPDATE_CURRENTLY_VIEWING";
export const NEXT_PAGE = "NEXT_PAGE";
export const TOGGLE_FAVORITE_MOVIE = "TOGGLE_FAVORITE_MOVIE";

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
	movies: Array<Movie>;
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
