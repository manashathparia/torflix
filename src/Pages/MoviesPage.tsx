import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "@material-ui/core/CircularProgress";
import { getMovies, handleFavMovies } from "../Redux/Actions/contentActions";
import { RootState } from "../Redux/Reducers";
import Card from "../Components/Card";
import { NEXT_PAGE } from "../Redux/Reducers/types";

export default function MoviesPage() {
	const dispatch = useDispatch();
	const { movies, page, favorites } = useSelector(
		(state: RootState) => state.content
	);

	useEffect(() => {
		if (movies.length > 0) return;
		dispatch(getMovies(1));
	}, [dispatch, movies]);

	const nextPage = () => dispatch({ type: NEXT_PAGE });

	const loadMore = () => {
		nextPage();
		dispatch(getMovies(page + 1));
	};

	const updateFavorites = (id: string) => dispatch(handleFavMovies(id));

	return (
		<div style={{ textAlign: "center", paddingTop: 10 }}>
			<InfiniteScroll
				next={loadMore}
				style={{ overflowY: "hidden" }}
				loader={
					<div>
						<br />
						<Loader />
					</div>
				}
				hasMore={true}
				dataLength={movies.length}
			>
				{movies.map((movie) => (
					<Card
						favorites={favorites}
						addFavorite={updateFavorites}
						slug={movie._id}
						rating={movie.rating.percentage / 10}
						title={movie.title}
						key={movie._id}
						image={movie.images.poster.replace("http", "https")}
					/>
				))}
			</InfiniteScroll>
		</div>
	);
}
