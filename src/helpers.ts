interface MovieDetails {
	title?: string;
	id?: string;
	lastWatchPosition?: number;
	totalWatchTime?: number;
	featuredImage?: string;
}

export function getRecentlyWatched(): MovieDetails[] {
	const recentlyWatched = localStorage.getItem("recently_watched");
	return JSON.parse(recentlyWatched || "[]");
}

export function saveToRecentlyWatched(movie: MovieDetails) {
	const movies = getRecentlyWatched();
	console.log(movie);
	console.log(movies);
	movies.forEach((_movie, i) => {
		if (_movie?.id === movie.id) {
			movies.splice(i, 1);
		}
	});
	localStorage.setItem("recently_watched", JSON.stringify([movie, ...movies]));
}
