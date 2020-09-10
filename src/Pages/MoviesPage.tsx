import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMovies } from "../Redux/Actions/contentActions";
import { RootState } from "../Redux/Reducers";
import Card from "../Components/Card";

export default function MoviesPage() {
	const dispatch = useDispatch();
	const { movies } = useSelector((state: RootState) => state.content);

	useEffect(() => {
		dispatch(getMovies(1));
	}, [dispatch]);

	return (
		<div style={{ textAlign: "center" }}>
			{movies.map((movie) => (
				<Card
					rating={movie.rating.percentage / 10}
					title={movie.title}
					key={movie._id}
					image={movie.images.poster}
				/>
			))}
		</div>
	);
}
