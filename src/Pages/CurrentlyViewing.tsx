import React, { useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useSelector } from "react-redux";
import { MoviesState } from "../Redux/Reducers/types";
import {
	Paper,
	Grid,
	Typography,
	makeStyles,
	Divider,
	Button,
	Chip,
	IconButton,
} from "@material-ui/core";
import Star from "@material-ui/icons/Star";
import PlayCircleOutline from "@material-ui/icons/PlayCircleOutline";
import WatchLater from "@material-ui/icons/WatchLaterOutlined";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";

const useStyles = makeStyles({
	paper: {
		background: "rgb(36 35 35)",
		padding: "40px",
	},
	padding: {
		padding: "5px 0",
	},
	qualityButtons: {
		padding: "5px",
		border: "2px solid",
		borderRadius: "3px",
		cursor: "pointer",
		margin: 5,
	},
	favIcon: {
		position: "absolute",
		right: "41px",
		fontSize: "35px",
	},
});

function time_convert(num: number) {
	const hours = Math.floor(num / 60);
	const minutes = num % 60;
	return `${hours}h ${minutes}m`;
}

export default function CurrentlyViewing({
	match,
}: RouteComponentProps<{ id: string }>) {
	const [quality, updateQuality] = useState(1080);
	const movies = useSelector(
		({ content }: { content: MoviesState }) => content.movies
	);
	const classes = useStyles();
	const movie = movies.filter((movie) => movie._id === match.params.id)[0];

	return (
		<Paper className={classes.paper}>
			<Grid container>
				<Grid sm={12} lg={4}>
					<img
						style={{ height: "550px", position: "fixed" }}
						src={movie?.images?.banner}
						alt=""
					/>
				</Grid>
				<Grid sm={12} lg={8}>
					<IconButton color="primary" className={classes.favIcon}>
						<FavoriteBorder fontSize="large" />
					</IconButton>
					<Typography className={classes.padding} variant="h4">
						{movie?.title}
					</Typography>
					{movie?.genres.map((genre) => (
						<Chip
							variant="outlined"
							key={genre}
							style={{ margin: "0 2px" }}
							color="secondary"
							label={genre}
						/>
					))}
					<div className={classes.padding}>
						{movie?.year}, {time_convert(Number(movie?.runtime))}
					</div>
					<div className={classes.padding}>
						<Star
							style={{
								color: "rgb(245, 197, 24)",
								fontSize: 20,
								verticalAlign: "bottom",
							}}
						/>{" "}
						{movie?.rating.percentage / 10}
					</div>

					<Typography className={classes.padding} variant="body1">
						{movie?.synopsis}
					</Typography>
					<Divider style={{ backgroundColor: "#313030", margin: "10px 0" }} />
					<Grid container>
						<Grid lg={6}>
							<div style={{ padding: "10px 0" }}>
								<span
									style={{
										borderColor: quality === 1080 ? "#cd2c2c" : "initial",
										color: quality === 1080 ? "#cd2c2c" : "white",
									}}
									className={classes.qualityButtons}
									onClick={() => updateQuality(1080)}
								>
									1080p
								</span>
								<span
									style={{
										borderColor: quality === 720 ? "#cd2c2c" : "initial",
										color: quality === 720 ? "#cd2c2c" : "white",
									}}
									className={classes.qualityButtons}
									onClick={() => updateQuality(720)}
								>
									720p
								</span>
							</div>
							<Button
								size="medium"
								variant="outlined"
								style={{
									fontSize: "30px",
									margin: "5px 0",
									border: "2px solid",
									color: "green",
								}}
							>
								<PlayCircleOutline style={{ fontSize: "35px" }} />
								WATCH
							</Button>
						</Grid>
						<Grid lg={6}>
							<Typography variant="h6">Torrent Details</Typography>
							Size: {`${movie?.torrents.en[`${quality}p`].filesize}`}
							<div>Seeds: {`${movie?.torrents.en[`${quality}p`].seed}`}</div>
							<div>Peers: {`${movie?.torrents.en[`${quality}p`].peer}`}</div>
						</Grid>
					</Grid>
					<Divider style={{ backgroundColor: "#313030", margin: "10px 0" }} />
					<div className={classes.padding}>
						<Typography variant="h6">Trailer</Typography>
						<iframe
							style={{ border: "none" }}
							height="250px"
							width="500px"
							src={`https://youtube.com/embed/${movie?.trailer.split("=")[1]}`}
							title="trailer"
						/>
					</div>
				</Grid>
			</Grid>
		</Paper>
	);
}
