import React from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: "#181b20",
		borderRadius: 0,
		minHeight: "calc(100vh )",
		[theme.breakpoints.down("sm")]: {
			minHeight: "calc(100vh )",
		},
	},
}));

export default function Content({ children }: { children: JSX.Element }) {
	const classes = useStyles();
	return <Paper className={classes.root}>{children}</Paper>;
}
