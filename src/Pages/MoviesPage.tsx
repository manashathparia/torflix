import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "@material-ui/core/CircularProgress";
import { getMovies } from "../Redux/Actions/contentActions";
import { RootState } from "../Redux/Reducers";
import Card from "../Components/Card";

export default function MoviesPage() {
	const [page, nextPage] = useState(1);
	const [favorites, _updateFavorites] = useState<string[]>([]);
	const dispatch = useDispatch();
	const { movies } = useSelector((state: RootState) => state.content);
	useEffect(() => {
		dispatch(getMovies(1));
	}, [dispatch]);

	const loadMore = () => {
		nextPage(page + 1);
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
		<div style={{ textAlign: "center", padding: "20px" }}>
			<InfiniteScroll
				next={loadMore}
				style={{ overflowY: "hidden" }}
				loader={
					<div>
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
						image={movie.images.poster}
					/>
				))}
			</InfiniteScroll>
		</div>
	);
}
