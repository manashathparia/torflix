import React from "react";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles({
	paper: {
		background: "#221f1f",
	},
});

const items = ["Genres", "Favorites", "Sort"];

export default function Menu({
	open,
	onClose,
}: {
	open: boolean;
	onClose: () => void;
}) {
	const classes = useStyles();
	return (
		<Drawer
			classes={{ paper: classes.paper }}
			variant="temporary"
			open={open}
			onClose={onClose}
		>
			<List style={{ width: "250px" }}>
				{items.map((item) =>
					item === "break" ? (
						<Divider key={item} />
					) : (
						<ListItem button key={item}>
							<Typography>{item}</Typography>
						</ListItem>
					)
				)}
			</List>
		</Drawer>
	);
}
