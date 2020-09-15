import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "@material-ui/core/CircularProgress";
import { getMovies } from "../Redux/Actions/contentActions";
import { RootState } from "../Redux/Reducers";
import Card from "../Components/Card";
import { NEXT_PAGE } from "../Redux/Reducers/types";

export default function MoviesPage() {
	const [favorites, _updateFavorites] = useState<string[]>([]);
	const dispatch = useDispatch();
	const { movies, page } = useSelector((state: RootState) => state.content);

	useEffect(() => {
		if (movies.length > 0) return;
		dispatch(getMovies(1));
	}, [dispatch]);

	const nextPage = () => dispatch({ type: NEXT_PAGE });

	const loadMore = () => {
		nextPage();
		dispatch(getMovies(page + 1));
	};

	const updateFavorites = (id: string) => {
		if (favorites.includes(id)) {
			const arr = [...favorites];
			const i = arr.indexOf(id);
			arr.splice(i, 1);
			_updateFavorites(arr);
			return;
		}
		_updateFavorites([...favorites, id]);
	};

	// const handleCurrentlyViewing = (id) => dispatch(updateCurrentlyViewing())

	return (
		<div style={{ textAlign: "center" }}>
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
