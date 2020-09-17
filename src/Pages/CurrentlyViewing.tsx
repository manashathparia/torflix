import React, { useState, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Movie } from "../Redux/Reducers/types";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Star from "@material-ui/icons/Star";
import PlayCircleOutline from "@material-ui/icons/PlayCircleOutline";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import PlayArrowRounded from "@material-ui/icons/PlayArrowRounded";
import Close from "@material-ui/icons/Close";
import Favorite from "@material-ui/icons/Favorite";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Backdrop from "@material-ui/core/Backdrop";
import Webtorrent from "webtorrent";
import prettierBytes from "prettier-bytes";
import { RootState } from "../Redux/Reducers";
import { handleFavMovies } from "../Redux/Actions/contentActions";
import TorrentDetails from "../Components/TorrentDetails";

const useStyles = makeStyles((theme) => ({
	paper: {
		background: "rgb(36 35 35)",
		padding: "75px 40px",
		[theme.breakpoints.down("sm")]: {
			padding: "0",
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
		[theme.breakpoints.down("sm")]: {
			position: "relative",
			right: 0,
		},
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
		borderRadius: 15,
		[theme.breakpoints.down("sm")]: {
			width: "100%",
		},
	},

	play: {
		width: "70px",
		height: "70px",
		border: "1px solid rgb(32 31 31)",
		borderRadius: "50%",
		position: "absolute",
		top: "-35px",
		margin: "auto",
		left: 0,
		right: 0,
		background: "rgb(36, 35, 35)",
		transition: "opacity 0.2s ease-in-out",
		boxShadow: "0 2px 39px -3px rgb(0 0 0 / 12%)",
		opacity: (props: any) => (props.show ? 1 : 0),
		"&:focus": {
			background: "rgb(36, 35, 35)",
		},
		"&:disabled": {
			background: "rgb(36, 35, 35)",
		},
	},
	detailsGrid: {
		padding: 20,
		borderRadius: 40,
		zIndex: 9,
		background: "rgb(36 35 35)",
		position: "relative",
	},
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: "#fff",
		background: "rgb(0 0 0 / 81%)",
	},
	overlayClose: {
		position: "absolute",
		top: 30,
		right: 40,
		[theme.breakpoints.down("sm")]: {
			right: 20,
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
	const [bottom, isBottom] = useState(true);
	const [playOverlay, togglePlayOverlay] = useState(false);
	const { movies, favorites } = useSelector(
		(state: RootState) => state.content
	);
	const dispatch = useDispatch();

	useEffect(() => {
		document.addEventListener("scroll", () =>
			window.pageYOffset > 20 ? isBottom(false) : isBottom(true)
		);
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

	const toggleFav = (id: string) => dispatch(handleFavMovies(id));

	const classes = useStyles({ show: bottom });

	const isMobile = useMediaQuery("(max-width:600px)");

	return movie ? (
		<Paper className={classes.paper}>
			<Grid container>
				<Grid style={{ height: 300 }} item sm={12} lg={4}>
					<div className="aa" style={{ position: "fixed" }}>
						<img
							className={classes.banner}
							src={movie.images.banner.replace("http", "https")}
							alt=""
						/>
					</div>
				</Grid>
				<Grid className={classes.detailsGrid} item sm={12} lg={8}>
					{isMobile && (
						<IconButton
							onClick={() => togglePlayOverlay(true)}
							disabled={!bottom}
							className={classes.play}
						>
							<PlayArrowRounded style={{ fontSize: 56, color: "white" }} />
						</IconButton>
					)}
					<div style={{ display: "flex", marginTop: 10 }}>
						<Typography
							style={{ flexGrow: 1 }}
							className={classes.padding}
							variant="h4"
						>
							{movie.title}
						</Typography>
						<IconButton
							color="primary"
							onClick={() => toggleFav(movie._id)}

							// className={classes.favIcon}
						>
							{favorites.includes(movie._id) ? (
								<Favorite fontSize="large" />
							) : (
								<FavoriteBorder fontSize="large" />
							)}
						</IconButton>
					</div>
					{movie.genres.map((genre) => (
						<Chip
							variant="outlined"
							key={genre}
							style={{ margin: "2px" }}
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
								!isMobile && (
									<>
										{" "}
										{/* <div style={{ padding: "10px 0" }}>
											<span
												className={`${classes.qualityButtons} ${
													quality === "1080p"
														? classes.qualityButtonSelected
														: ""
												}`}
												onClick={() => updateQuality("1080p")}
											>
												1080p
											</span>
											<span
												className={`${classes.qualityButtons} ${
													quality === "720p"
														? classes.qualityButtonSelected
														: ""
												}`}
												onClick={() => updateQuality("720p")}
											>
												720p
											</span>
										</div> */}
										<Button
											size="medium"
											variant="outlined"
											style={{
												fontSize: "30px",
												margin: "5px 0",
												border: "2px solid",
												color: "green",
											}}
											// onClick={() => stream(movie.torrents.en[quality].url)}4
											onClick={() => togglePlayOverlay(true)}
										>
											<PlayCircleOutline style={{ fontSize: "35px" }} />
											WATCH
										</Button>
									</>
								)
							)}
						</Grid>
						<Grid item={true} lg={6} xs={12} sm={12}>
							{/* <Typography variant="h6">Torrent Details</Typography>
							{loading || readyToStream ? (
								<>
									<div>Status: {torrentInfo.status}</div>
									<div>D:{prettierBytes(torrentInfo.download)}/s</div>
									<div>U:{prettierBytes(torrentInfo.upload)}/s </div>
									<div>P:{(100 * torrentInfo.progress).toFixed(1)}% </div>
								</>
							) : (
								<>
									Size: {movie.torrents.en[quality]?.filesize}
									<div>Seeds: {movie.torrents.en[quality]?.seed}</div>
									<div>Peers: {movie.torrents.en[quality]?.peer}</div>
								</>
							)} */}
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
			<Backdrop className={classes.backdrop} open={playOverlay}>
				<IconButton
					onClick={() => togglePlayOverlay(false)}
					className={classes.overlayClose}
				>
					<Close style={{ fontSize: "30px", color: "whitesmoke" }} />
				</IconButton>
				<TorrentDetails
					seeds={movie.torrents.en["1080p"]?.seed}
					peers={movie.torrents.en["1080p"]?.peer}
					size={movie.torrents.en["1080p"]?.filesize}
					res={"1080p"}
				/>
				<TorrentDetails
					seeds={movie.torrents.en["1080p"]?.seed}
					peers={movie.torrents.en["1080p"]?.peer}
					size={movie.torrents.en["720p"]?.filesize}
					res={"720p"}
				/>
			</Backdrop>
		</Paper>
	) : (
		<>
			<br />
			<CircularProgress style={{ display: "block", margin: "auto" }} />
		</>
	);
}
