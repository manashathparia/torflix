export interface Movie {
	_id: string;
	imdb_id: string;
	title: string;
	year: string;
	synopsis: string;
	runtime: string;
	released: number;
	trailer: string;
	certification: string;
	torrents: object;
	genres: Array<string>;
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

export interface MoviesState {
	movies: Array<Movie>;
	currentlyViewing: Movie | object;
}
const initial: MoviesState = {
	movies: [],
	currentlyViewing: {},
};

// constants
export const ADD_MOVIES = "ADD_MOVIES";
export const UPDATE_CURRENTLY_VIEWING = "UPDATE_CURRENTLY_VIEWING";

export default function moviesReducer(
	state = initial,
	{ type, payload }: { type: string; payload: Movie | Array<Movie> }
): MoviesState {
	switch (type) {
		case ADD_MOVIES:
			return { ...state, movies: [...state.movies, ...payload] };

		case UPDATE_CURRENTLY_VIEWING:
			return { ...state, currentlyViewing: payload };

		default:
			return state;
	}
}
