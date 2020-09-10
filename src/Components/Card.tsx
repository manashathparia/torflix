import React from "react";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import Star from "@material-ui/icons/Star";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
	height: {
		height: 255,
		width: 170,
	},
	card: {
		display: "inline-block",
		margin: "15px 5px",
		transition: "all .2s ease-in-out",
		position: "relative",
		cursor: "pointer",
		boxShadow: "0 2px 43px -4px rgba(0,0,0,.19)",
		[theme.breakpoints.up("sm")]: {
			"&:hover": {
				margin: "5px 25px",
				transform: "scale(1.2)",
			},
		},
	},
	image: {
		borderRadius: "4px",
	},
	loveIcon: {
		position: "absolute",
		top: "10px",
		right: "10px",
		color: "#cd2c2c",
		background: "#8f87874a",
		borderRadius: "50%",
		padding: "4px",
	},
	rating: {
		position: "absolute",
		bottom: 5,
		left: 5,
		color: "white",
		fontSize: 13,
	},
}));

export default function Card({
	image,
	title,
	rating,
}: {
	image: string;
	title: string;
	rating: number;
}) {
	const classes = useStyles();
	return (
		<div title={title} className={`${classes.height} ${classes.card}`}>
			<FavoriteBorder className={classes.loveIcon} />
			<img
				className={`${classes.height} ${classes.image}`}
				src={image}
				alt=""
			/>
			<span className={classes.rating}>
				<Star
					style={{ color: "#f5c518", fontSize: 19, verticalAlign: "middle" }}
				/>{" "}
				{rating}
			</span>
		</div>
	);
}
