import React from "react";
import { Switch, Route } from "react-router-dom";
import MoviesPage from "./MoviesPage";
import CurrentlyViewing from "./CurrentlyViewing";

export default function Pages() {
	return (
		<Switch>
			<Route path="/" component={MoviesPage} exact />
			<Route path="/movie/:id" component={CurrentlyViewing} exact />
		</Switch>
	);
}
