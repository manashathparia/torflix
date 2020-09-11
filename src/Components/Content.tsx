import React from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: "#221f1f",
		borderRadius: 0,
		minHeight: "calc(100vh - 64px)",
		[theme.breakpoints.down("sm")]: {
			minHeight: "calc(100vh - 56px)",
		},
	},
}));

export default function Content({ children }: { children: JSX.Element }) {
	const classes = useStyles();
	return <Paper className={classes.root}>{children}</Paper>;
}
