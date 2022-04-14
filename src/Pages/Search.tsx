import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "@material-ui/core/CircularProgress";
import { searchMovies, handleFavMovies } from "../Redux/Actions/contentActions";
import { RootState } from "../Redux/Reducers";
import Card from "../Components/Card";
import {
	CLEAR_SEARCH_RESULTS,
	NEXT_SEARCH_PAGE,
} from "../Redux/Reducers/types";
import ResumeVideo from "../Components/ResumeVideo";
import { AppBar, IconButton, Toolbar, Typography } from "@material-ui/core";
import BackIcon from "../icons/BackIcon";
import { makeStyles } from "@material-ui/core/styles";

const styles = makeStyles((theme) => ({
	appBar: {
		boxShadow: "none",
		position: "relative",
		// bacskground: "#181b20",
		background:
			"linear-gradient(to bottom, #191c21c7 0%, rgb(34 31 31 / 0%) 100%) !important",
		top: 0,
	},
}));

export default function SearchPage({ history, match }: any) {
	const dispatch = useDispatch();
	const {
		movies: {
			search: { searchResults: movies, searchPage, searchLoaded },
			favorites,
		},
	} = useSelector((state: RootState) => state);

	let count = 1;
	useEffect(() => {
		if (searchLoaded) return;
		dispatch(searchMovies(match.params.id));
		count++;
	}, [dispatch, movies]);

	useEffect(() => {
		return () => {
			dispatch({ type: CLEAR_SEARCH_RESULTS });
		};
	}, []);

	const nextPage = () => dispatch({ type: NEXT_SEARCH_PAGE });

	const loadMore = () => {
		nextPage();
		dispatch(searchMovies(match.params.id, searchPage + 1));
	};

	const updateFavorites = (id: string) => dispatch(handleFavMovies(id));

	const classes = styles();
	return (
		<>
			<AppBar className={classes.appBar} position="static">
				<Toolbar>
					{" "}
					<IconButton onClick={history.goBack}>
						{" "}
						<BackIcon style={{ fontSize: 30, color: "white" }} />
					</IconButton>
					<Typography variant={"h6"}>Search Results</Typography>
				</Toolbar>
			</AppBar>

			<br />
			<Typography variant="button" style={{ paddingLeft: "3%", fontSize: 18 }}>
				{match.params.id}
			</Typography>
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
					hasMore={searchLoaded ? Boolean(movies.length) : true}
					dataLength={movies.length}
				>
					{movies.map((movie: any) => {
						return (
							<Card
								favorites={favorites}
								addFavorite={updateFavorites}
								slug={movie._id}
								rating={movie.rating.percentage / 10}
								title={movie.title}
								key={movie._id}
								image={movie.images.poster.replace("http", "https")}
								type="movie"
							/>
						);
					})}
					{searchLoaded && movies.length <= 0 && <Typography>ok</Typography>}
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
