import React from "react";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import Favorite from "@material-ui/icons/Favorite";
import Star from "@material-ui/icons/Star";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Link } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles((theme) => ({
	height: {
		height: 255,
		width: 170,
		[theme.breakpoints.down("xs")]: {
			height: 250,
			width: "45%",
		},
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
		width: "100%",
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

interface CardProps {
	image: string;
	title: string;
	rating: number;
	slug: string;
	favorites: Array<string>;
	addFavorite: Function;
}

export default function Card({
	image,
	title,
	rating,
	slug,
	favorites,
	addFavorite,
}: CardProps) {
	const classes = useStyles();
	return (
		<div title={title} className={`${classes.height} ${classes.card}`}>
			<IconButton
				onClick={() => addFavorite(slug)}
				className={classes.loveIcon}
			>
				{favorites.includes(slug) ? <Favorite /> : <FavoriteBorder />}
			</IconButton>
			<Link to={`/movie/${slug}`}>
				<img
					className={`${classes.height} ${classes.image}`}
					src={image}
					alt=""
				/>
			</Link>

			<span className={classes.rating}>
				<Star
					style={{ color: "#f5c518", fontSize: 19, verticalAlign: "middle" }}
				/>{" "}
				{rating}
			</span>
		</div>
	);
}
