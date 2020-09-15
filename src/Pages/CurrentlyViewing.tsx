import React, { useState, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useSelector } from "react-redux";
import { Movie } from "../Redux/Reducers/types";
import {
	Paper,
	Grid,
	Typography,
	makeStyles,
	Divider,
	Button,
	Chip,
	IconButton,
	Snackbar,
	CircularProgress,
} from "@material-ui/core";
import Star from "@material-ui/icons/Star";
import PlayCircleOutline from "@material-ui/icons/PlayCircleOutline";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import Webtorrent from "webtorrent";
import prettierBytes from "prettier-bytes";
import { formatDistance } from "date-fns";
import { RootState } from "../Redux/Reducers";

const useStyles = makeStyles((theme) => ({
	paper: {
		background: "rgb(36 35 35)",
		padding: "40px",
		[theme.breakpoints.down("sm")]: {
			padding: "20px",
		},
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
		color: "white",
	},
	qualityButtonSelected: {
		borderColor: "#cd2c2c",
		color: "#cd2c2c",
	},
	favIcon: {
		position: "absolute",
		right: "41px",
		fontSize: "35px",
	},
	banner: {
		height: "550px",
		position: "fixed",
		[theme.breakpoints.down("sm")]: {
			position: "relative",
			height: "auto",
			width: "100%",
		},
	},
	iframe: {
		border: "none",
		height: "250px",
		width: "500px",
		[theme.breakpoints.down("sm")]: {
			width: "100%",
		},
	},
}));

declare global {
	interface Window {
		WEBTORRENT_ANNOUNCE: Array<Array<string>>;
	}
}

declare module "prettier-bytes" {}

window.WEBTORRENT_ANNOUNCE = [
	["udp://tracker.openbittorrent.com:80"],
	["udp://tracker.internetwarriors.net:1337"],
	["udp://tracker.leechers-paradise.org:6969"],
	["udp://tracker.coppersurfer.tk:6969"],
	["udp://exodus.desync.com:6969"],
	["wss://tracker.webtorrent.io"],
	["wss://tracker.btorrent.xyz"],
	["wss://tracker.openwebtorrent.com"],
	["wss://tracker.fastcast.nz"],
];

function time_convert(num: number) {
	const hours = Math.floor(num / 60);
	const minutes = num % 60;
	return `${hours}h ${minutes}m`;
}

export default function CurrentlyViewing({
	match,
}: RouteComponentProps<{ id: string }>) {
	const [quality, updateQuality] = useState("1080p");
	const [movie, updateMovie] = useState<Movie | null>(null);
	const [readyToStream, handleReadyToStream] = useState(false);
	const [loading, toggleLoading] = useState(false);
	const [torrentInfo, updateTorrentInfo] = useState({
		download: 0,
		upload: 0,
		progress: 0,
		remaining: Infinity,
		show: false,
		status: "Loading torrent",
	});

	const movies = useSelector((state: RootState) => state.content.movies);

	useEffect(() => {
		const movie = movies.filter((movie) => movie._id === match.params.id)[0];

		const fetchMovie = async () => {
			const movie = await (
				await fetch(`https://torflix.vercel.app/api/movies/${match.params.id}`)
			).json();
			updateMovie(movie);
		};

		if (!movie) {
			fetchMovie();
			return;
		}
		updateMovie(movie);
	}, [match.params.id, movies]);

	function stream(magnetUri: string) {
		toggleLoading(true);
		const client = new Webtorrent();
		client.add(magnetUri, { path: "/" }, (torrent) => {
			const file = torrent.files.find(function (file) {
				return file.name.endsWith(".mp4");
			});
			toggleLoading(false);
			handleReadyToStream(true);
			file?.renderTo("video#video");
			updateTorrentInfo({
				...torrentInfo,
				status: "Connecting to peers",
			});
			torrent.on("download", () => {
				updateTorrentInfo({
					download: torrent.downloadSpeed,
					upload: torrent.uploadSpeed,
					progress: torrent.progress,
					remaining: torrent.timeRemaining,
					show: true,
					status: "Downloading",
				});
			});
		});

		client.on("error", (err) => {
			console.error("err", err);
			toggleLoading(false);
		});
	}

	const classes = useStyles();

	return movie ? (
		<Paper className={classes.paper}>
			<Grid container>
				<Grid item sm={12} lg={4}>
					<img
						className={classes.banner}
						src={movie.images.banner.replace("http", "https")}
						alt=""
					/>
				</Grid>
				<Grid item sm={12} lg={8}>
					<IconButton color="primary" className={classes.favIcon}>
						<FavoriteBorder fontSize="large" />
					</IconButton>
					<Typography className={classes.padding} variant="h4">
						{movie.title}
					</Typography>
					{movie.genres.map((genre) => (
						<Chip
							variant="outlined"
							key={genre}
							style={{ margin: "0 2px" }}
							color="secondary"
							label={genre}
						/>
					))}
					<div className={classes.padding}>
						{movie.year}, {time_convert(Number(movie.runtime))}
					</div>
					<div className={classes.padding}>
						<Star
							style={{
								color: "rgb(245, 197, 24)",
								fontSize: 20,
								verticalAlign: "bottom",
							}}
						/>{" "}
						{movie.rating.percentage / 10}
					</div>
					<Typography className={classes.padding} variant="body1">
						{movie.synopsis}
					</Typography>
					<Divider style={{ backgroundColor: "#313030", margin: "10px 0" }} />
					<Grid container>
						<Grid item={true} lg={6} xs={12} sm={12}>
							{readyToStream ? (
								<video style={{ width: "98%" }} autoPlay muted id="video" />
							) : loading ? (
								<div style={{ padding: "10px 30px" }}>
									<CircularProgress />
								</div>
							) : (
								<>
									<div style={{ padding: "10px 0" }}>
										<span
											className={`${classes.qualityButtons} ${
												quality === "1080p" ? classes.qualityButtonSelected : ""
											}`}
											onClick={() => updateQuality("1080p")}
										>
											1080p
										</span>
										<span
											className={`${classes.qualityButtons} ${
												quality === "720p" ? classes.qualityButtonSelected : ""
											}`}
											onClick={() => updateQuality("720p")}
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
										onClick={() => stream(movie.torrents.en[quality].url)}
									>
										<PlayCircleOutline style={{ fontSize: "35px" }} />
										WATCH
									</Button>
								</>
							)}
						</Grid>
						<Grid item={true} lg={6} xs={12} sm={12}>
							<Typography variant="h6">Torrent Details</Typography>
							{loading || readyToStream ? (
								<>
									<div>Status: {torrentInfo.status}</div>
									<div>D:{prettierBytes(torrentInfo.download)}/s</div>
									<div>U:{prettierBytes(torrentInfo.upload)}/s </div>
									<div>P:{(100 * torrentInfo.progress).toFixed(1)}% </div>
								</>
							) : (
								<>
									Size: {movie.torrents.en[quality].filesize}
									<div>Seeds: {movie.torrents.en[quality].seed}</div>
									<div>Peers: {movie.torrents.en[quality].peer}</div>
								</>
							)}
						</Grid>
					</Grid>

					<Divider style={{ backgroundColor: "#313030", margin: "10px 0" }} />
					<div className={classes.padding}>
						<Typography variant="h6">Trailer</Typography>
						<iframe
							className={classes.iframe}
							src={`https://youtube.com/embed/${movie.trailer.split("=")[1]}`}
							title="trailer"
						/>
					</div>
				</Grid>
			</Grid>

			{/* <Snackbar
				open={torrentInfo.show}
				anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
				message={`
				Torrent: D:${prettierBytes(torrentInfo.download)}/s 
				U:${prettierBytes(torrentInfo.upload)}/s 
				P:${(100 * torrentInfo.progress).toFixed(1)}% 
				ETA: ${
					torrentInfo.remaining !== Infinity
						? formatDistance(torrentInfo.remaining, 0, { includeSeconds: true })
						: "More than your lifespan remaining"
				}`}
			/> */}
		</Paper>
	) : (
		<>
			<br />
			<CircularProgress style={{ display: "block", margin: "auto" }} />
		</>
	);
}
