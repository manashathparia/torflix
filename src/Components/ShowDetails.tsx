import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const useStylesSSD = makeStyles((theme) => ({
	root: {
		// [theme.breakpoints.down("sm")]: {
		// 	width: "90%",
		// 	height: 130,
		// },
		border: "1px solid",
		width: 200,
		height: 250,
		margin: 5,
		marginLeft: 0,
		borderRadius: 5,
	},
}));

export function ShowSeasonDetails({ seasons }: any) {
	const classes = useStylesSSD();
	const isMobile = useMediaQuery("(max-width:600px)");

	return (
		<div
			style={{
				width: "100%",
				overflowX: "scroll",
				display: "-webkit-inline-box",
			}}
		>
			{seasons.map((season: any) => (
				<div className={classes.root}></div>
			))}
		</div>
	);
}
