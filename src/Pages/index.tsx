import React from "react";
import { Switch, Route, RouteComponentProps, Redirect } from "react-router-dom";
import MoviesPage from "./MoviesPage";
import ShowsPage from "./ShowsPage";
import CurrentlyViewing from "./CurrentlyViewing";
import HomePage from "./HomePages";

export default function Pages({ client }: any) {
	console.log(client);
	return (
		<Switch>
			<Route
				path="/"
				component={() => <Redirect to={{ pathname: "/movies" }} />}
				exact
			/>
			<Route
				path="/movie/:id"
				component={(props: RouteComponentProps<{ id: string }>) => (
					<CurrentlyViewing type="movie" {...props} client={client} />
				)}
				exact
			/>
			<Route
				path="/show/:id"
				component={(props: RouteComponentProps<{ id: string }>) => (
					<CurrentlyViewing type="show" {...props} client={client} />
				)}
				exact
			/>
			<HomePage />
		</Switch>
	);
}
