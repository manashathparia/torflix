import React from "react";
import { Switch, Route } from "react-router-dom";
import MoviesPage from "./MoviesPage";

export default function Pages() {
	return (
		<Switch>
			<Route path="/" component={MoviesPage} exact />
		</Switch>
	);
}
