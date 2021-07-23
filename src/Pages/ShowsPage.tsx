import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "@material-ui/core/CircularProgress";
import {
	getInitalContent,
	handleFavMovies,
} from "../Redux/Actions/contentActions";
import { RootState } from "../Redux/Reducers";
import Card from "../Components/Card";
import { NEXT_PAGE } from "../Redux/Reducers/types";
import ResumeVideo from "../Components/ResumeVideo";
import BottomNav from "../Components/BottomNav";
import { Typography } from "@material-ui/core";

export default function ShowssPage({ history }: any) {
	const dispatch = useDispatch();
	const {
		shows: { showsList: shows, page, favorites },
	} = useSelector((state: RootState) => state);

	useEffect(() => {
		if (shows.length > 0) return;
		// dispatch(getInitalContent(1));
	}, [dispatch, shows]);

	const nextPage = () => dispatch({ type: NEXT_PAGE });

	const loadMore = () => {
		nextPage();
		dispatch(getInitalContent(page + 1));
	};

	const updateFavorites = (id: string) => dispatch(handleFavMovies(id));

	return (
		<>
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
					dataLength={shows.length}
				>
					{shows.map((movie: any) => {
						return (
							<Card
								favorites={favorites}
								addFavorite={updateFavorites}
								slug={movie._id}
								rating={movie.rating.percentage / 10}
								title={movie.title}
								key={movie._id}
								image={movie.images.poster.replace("http", "https")}
							/>
						);
					})}
				</InfiniteScroll>
			</div>
			<ResumeVideo push={history.push} />
		</>
	);
}

function shuffle(array: any) {
	var currentIndex = array.length,
		randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex],
			array[currentIndex],
		];
	}

	return array;
}
