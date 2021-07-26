import React, { useEffect, useState } from "react";
import { Link, Route, Switch } from "react-router-dom";
import makeStyles from "@material-ui/core/styles/makeStyles";
import MoviesPage from "./MoviesPage";
import ShowsPage from "./ShowsPage";
import Header from "../Components/Header";

const styles = makeStyles({
	root: {
		padding: "12px 0 12px 20px",
		fontSize: 20,
		textAlign: "initial",
	},
	span: {
		paddingRight: 10,
		WebkitTapHighlightColor: "transparent",
		textDecoration: "none",
	},
});

export default function HomePage({ location }: any) {
	const [currentLoc, updateLoc] = useState("movies");
	useEffect(() => {
		updateLoc(location.pathname.split("/")[1]);
	}, []);

	const classes = styles();
	return (
		<>
			<Header />
			<div className={classes.root}>
				<Link
					onClick={() => updateLoc("movies")}
					to="/movies"
					className={classes.span}
					style={{
						color: currentLoc === "movies" ? "#cd2c2c" : "inherit",
					}}
				>
					Movies
				</Link>
				<Link
					onClick={() => updateLoc("shows")}
					to="/shows"
					className={classes.span}
					style={{
						color: currentLoc === "shows" ? "#cd2c2c" : "inherit",
					}}
				>
					Shows
				</Link>
				<span>Favorites</span>
			</div>
			<Switch>
				<Route path="/movies" component={MoviesPage} exact />
				<Route path="/shows" component={ShowsPage} exact />
			</Switch>
		</>
	);
}
