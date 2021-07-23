import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import SearchIcon from "../icons/search";
import Home from "../icons/Home";
import FavIcon from "../icons/FavIcon";
import MovieIcon from "../icons/MovieIcon";
import TvIcon from "../icons/TvIcon";

const useStyles = makeStyles({
	root: {
		width: "100%",
		position: "fixed",
		bottom: 0,
		background: "#181b20",
	},
	icon: {
		color: "#b5b5b8 !important",
	},
});

export default function BottomNav() {
	const classes = useStyles();
	const [value, setValue] = React.useState("movies");

	const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
		setValue(newValue);
	};

	return (
		<BottomNavigation
			value={value}
			onChange={handleChange}
			className={classes.root}
		>
			<BottomNavigationAction
				classes={{ iconOnly: classes.icon }}
				value="movies"
				label="Movies"
				disableTouchRipple
				icon={<MovieIcon />}
			/>
			<BottomNavigationAction
				value="tv"
				label="Shows"
				disableTouchRipple
				classes={{ iconOnly: classes.icon }}
				icon={<TvIcon />}
			/>
			<BottomNavigationAction
				value="search"
				label="Search"
				disableTouchRipple
				classes={{ iconOnly: classes.icon }}
				icon={<SearchIcon />}
			/>
			<BottomNavigationAction
				value="favorites"
				label="Favorites"
				classes={{ iconOnly: classes.icon }}
				disableTouchRipple
				icon={<FavIcon />}
			/>
		</BottomNavigation>
	);
}
