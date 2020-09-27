import React from "react";
import { Switch, Route, RouteComponentProps } from "react-router-dom";
import MoviesPage from "./MoviesPage";
import CurrentlyViewing from "./CurrentlyViewing";

export default function Pages({ client }: any) {
	console.log(client);
	return (
		<Switch>
			<Route path="/" component={MoviesPage} exact />
			<Route
				path="/movie/:id"
				component={(props: RouteComponentProps<{ id: string }>) => (
					<CurrentlyViewing {...props} client={client} />
				)}
				exact
			/>
		</Switch>
	);
}
