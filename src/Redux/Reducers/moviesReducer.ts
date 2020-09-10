export interface Movie {
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

export const ADD_MOVIES = "ADD_MOVIES";

export default function moviesReducer(
	state = initial,
	{ type, payload }: { type: string; payload: Movie | Array<Movie> }
): MoviesState {
	switch (type) {
		case ADD_MOVIES:
			return { ...state, movies: [...state.movies, ...payload] };
		default:
			return state;
	}
}
