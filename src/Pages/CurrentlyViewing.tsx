import React, { useState, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Movie, Show } from "../Redux/Reducers/types";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Chip from "@material-ui/core/Chip";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Star from "@material-ui/icons/Star";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import PlayArrowRounded from "@material-ui/icons/PlayArrowRounded";
import Favorite from "@material-ui/icons/Favorite";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Select from "@material-ui/core/Select";
import Webtorrent from "webtorrent";
import prettierBytes from "prettier-bytes";
import { RootState } from "../Redux/Reducers";
import {
	handleFavMovies,
	updateCurrentlyViewing,
} from "../Redux/Actions/contentActions";
import TorrentDetails from "../Components/TorrentDetails";
import ArrowBack from "@material-ui/icons/ArrowBack";
import { saveToRecentlyWatched } from "../helpers";
import Header, { HeaderAlt } from "../Components/Header";
import { ShowSeasonDetails } from "../Components/ShowDetails";
import { MenuItem } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	paper: {
		background: "#181b20",
		boxShadow: "none",
		paddingTop: 30,
		padding: 90,
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
		borderRadius: 15,
		[theme.breakpoints.down("sm")]: {
			borderRadius: 0,
			position: "fixed",
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
		background: "#181b20",
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
	imageGrid: {
		[theme.breakpoints.up("sm")]: {
			textAlign: "center",
			paddingTop: 40,
		},
	},
	detailsGrid: {
		padding: 20,
		// borderRadius: 40,
		borderRadius: (props: any) => (props.play ? 0 : "40px 40px 0 0"),
		zIndex: 9,
		background: "#181b20",
		position: "relative",
		width: "100%",
		// marginTop: (props: any) => (props.play ? 0 : 300),
		transition: "all .2s ease-in-out",
		willChange: "margin-top, border-radius",
		[theme.breakpoints.down("sm")]: {
			marginTop: 300,
		},
	},
	videoPlay: {
		width: "100%",
		position: "absolute",
		margin: "auto",
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		fontSize: 60,
	},
}));

declare global {
	interface Window {
		WEBTORRENT_ANNOUNCE: Array<Array<string>>;
	}
}

declare module "prettier-bytes" {}

const announceList: any = [
	["wss://tracker.openwebtorrent.com"],
	// ["wss://tracker.webtorrent.io"],
	["wss://tracker.btorrent.xyz"],
];

window.WEBTORRENT_ANNOUNCE = announceList
	.map(function (arr: string[]) {
		return arr[0];
	})
	.filter(function (url: string) {
		return url.indexOf("wss://") === 0 || url.indexOf("ws://") === 0;
	});

function time_convert(num: number) {
	const hours = Math.floor(num / 60);
	const minutes = num % 60;
	return `${hours}h ${minutes}m`;
}

export default function CurrentlyViewing({
	match,
	location,
	type,
	history,
	client,
}: RouteComponentProps<{ id: string }> & {
	client: Webtorrent.Instance;
	type: "movie" | "show";
}) {
	const [quality, updateQuality] = useState("1080p");
	const [availableQualities, updateAvailableQualities] = useState<string[]>([]);
	const [movie, updateMovie] = useState<Movie | Show | null>(null);
	const [isMovie, toggleIsMovie] = useState(false);
	const [readyToStream, handleReadyToStream] = useState(false);
	const [selectedSeason, updateSelectedSeason] = useState(1);
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

	const {
		movies: {
			moviesList: movies,
			favorites,
			currentlyViewing: watchingRightNow,
		},
		shows: { showsList: shows, currentlyViewing: watchingRightNow2 },
	} = useSelector((state: RootState) => state);
	const dispatch = useDispatch();

	const isMobile = useMediaQuery("(max-width:600px)");

	useEffect(() => {
		if (movie) {
			document.title = movie.title;
		}
	}, [movie]);

	useEffect(() => {
		document.addEventListener("scroll", () =>
			window.pageYOffset > 50 ? isBottom(false) : isBottom(true)
		);
		toggleIsMovie(type === "movie");
		const contentType = isMovie ? movies : shows;
		const content = (contentType as any[]).filter(
			// https://github.com/microsoft/TypeScript/issues/36390
			(movie) => movie._id === match.params.id
		)[0];

		async function fetchMovie() {
			const data = await (
				await fetch(
					`https://torflix-jswtp874x-manashathparia.vercel.app/fetch/?url=https://popcorn-time.ga/${type}/${match.params.id}`
				)
			).json();
			console.log(data);
			if (type === "show" && data) {
				data.seasons = sortAndMerge(data.episodes);
				delete data.episodes;
			}
			updateMovie(data);
		}

		if (!movie) {
			fetchMovie();
			return;
		}
		updateMovie(movie);

		// return () => client.destroy?.();
	}, [match.params.id, movies]);

	const resume = JSON.parse(
		location.search?.split("?")[1]?.split("=")[1] || "false"
	);

	useEffect(() => {
		if (movie && isMovie) {
			const _qualities = Object.keys((movie as Movie).torrents.en).sort(
				(a, b) => {
					return Number(a.match(/(\d+)/g)![0]) - Number(b.match(/(\d+)/g)![0]);
				}
			);
			updateAvailableQualities(_qualities);
		}
	}, [movie]);

	useEffect(() => {
		if (resume) {
			isMobile && togglePlayOverlay(true);
			handleReadyToStream(true);
		}
	}, [resume, isMobile]);

	const handleVideoOnMount = () => {
		if (resume) {
			watchingRightNow.quality && updateQuality(watchingRightNow.quality);
			const torrent = client.get(watchingRightNow.magnetURI || "");
			console.log(torrent);
			if (torrent) {
				handleTorrent(torrent);
			} else {
				handleReadyToStream(false);
			}
		}
	};

	function handleTorrent(torrent: Webtorrent.Torrent) {
		const file = torrent.files.find(function (file) {
			return file.name.endsWith(".mp4");
		});
		handleReadyToStream(true);
		toggleLoading(false);
		updateTorrentInfo({
			...torrentInfo,
			status: "Connecting to peers",
		});
		file?.renderTo("video#video");
		const video = document.getElementById("video") as HTMLMediaElement;
		video?.play();
		video.currentTime = watchingRightNow.position || 0;

		console.log(stream);
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
	}

	function stream(magnetUri: string) {
		const torrent = client.get(magnetUri);
		if (torrent) {
			handleTorrent(torrent);
		} else {
			toggleLoading(true);
			client.add(magnetUri, handleTorrent);
		}
		setInterval(() => {
			const videoEl = document.getElementById("video") as HTMLMediaElement;
			if (videoEl) {
				const lastWatchPosition = videoEl.currentTime;
				const totalWatchTime = videoEl.duration;
				if (lastWatchPosition > 0) {
					saveToRecentlyWatched({
						title: movie?.title,
						id: movie?._id,
						lastWatchPosition,
						totalWatchTime,
					});
					dispatch(
						updateCurrentlyViewing({
							id: match.params.id,
							title: movie?.title || "",
							magnetURI: magnetUri,
							position: lastWatchPosition,
							quality,
						})
					);
				}
			}
		}, 5000);

		client.on("error", (err) => {
			console.error("err", err);
			toggleLoading(false);
		});
	}

	const toggleFav = (id: string) => dispatch(handleFavMovies(id));

	const classes = useStyles({
		show: bottom && !playOverlay,
		play: playOverlay,
	});

	return (
		<>
			{isMobile ? <HeaderAlt history={history} /> : <Header />}

			{movie ? (
				<Paper
					className={classes.paper}
					style={{
						maxHeight: playOverlay ? "100vh" : "auto",
						overflow: playOverlay ? "hidden" : "auto",
					}}
				>
					<Grid container>
						<Grid className={classes.imageGrid} item sm={12} lg={4}>
							<div className="aa">
								<img
									className={classes.banner}
									src={movie.images.banner.replace("http", "https")}
								/>
							</div>
						</Grid>
						<Grid
							className={classes.detailsGrid}
							style={{ transform: playOverlay ? "translateY(-300px)" : "none" }}
							item
							sm={12}
							lg={8}
						>
							{isMobile && (
								<IconButton
									onClick={() => togglePlayOverlay(true)}
									disabled={!bottom}
									className={classes.play}
								>
									<PlayArrowRounded style={{ fontSize: 56, color: "white" }} />
								</IconButton>
							)}
							{!playOverlay ? (
								<>
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
										{movie.year}
										{isMovie ? (
											<>, {time_convert(Number((movie as Movie).runtime))}</>
										) : (
											`, ${(movie as Show).num_seasons} Seasons`
										)}
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
									<Divider
										style={{ backgroundColor: "initial", margin: "10px 0" }}
									/>
									<Grid container>
										<Grid item={true} lg={6} xs={12} sm={12}>
											{!isMobile ? (
												<>
													<div style={{ padding: "0 10px 10px 0" }}>
														<Video
															handleStream={() => {
																stream(
																	isMovie
																		? (movie as Movie).torrents.en[quality].url
																		: (movie as Show).seasons[selectedSeason][0]
																				.torrents[quality].url
																);
															}}
															readyToStream={readyToStream}
															loading={loading}
															image={movie.images.fanart}
															handleVideoOnMount={handleVideoOnMount}
														/>
													</div>

													<div style={{ padding: "10px 0" }}>
														{availableQualities.map((_quality) => (
															<span
																className={`${classes.qualityButtons} ${
																	quality === _quality
																		? classes.qualityButtonSelected
																		: ""
																}`}
																onClick={() => {
																	handleReadyToStream(false);
																	updateQuality(_quality);
																}}
															>
																{_quality}
															</span>
														))}
													</div>
												</>
											) : null}
										</Grid>
										<Grid item={true} lg={6} xs={12} sm={12}>
											{!isMobile && (
												<>
													<Typography variant="h6">Torrent Details</Typography>
													{loading || readyToStream ? (
														<>
															<div>Status: {torrentInfo.status}</div>
															<div>
																D:{prettierBytes(torrentInfo.download)}/s
															</div>
															<div>
																U:{prettierBytes(torrentInfo.upload)}/s{" "}
															</div>
															<div>
																P:{(100 * torrentInfo.progress).toFixed(1)}%{" "}
															</div>
														</>
													) : (
														<>
															{/* Size: {movie.torrents.en[quality]?.filesize}
															<div>
																Seeds: {movie.torrents.en[quality]?.seed}
															</div>
															<div>
																Peers: {movie.torrents.en[quality]?.peer}
															</div> */}
														</>
													)}
												</>
											)}
										</Grid>
									</Grid>
									{!isMobile && (
										<Divider
											style={{ backgroundColor: "initial", margin: "10px 0" }}
										/>
									)}
									{isMovie ? (
										<div className={classes.padding}>
											<Typography variant="h6">Trailer</Typography>

											<iframe
												className={classes.iframe}
												src={`https://youtube.com/embed/${
													(movie as Movie).trailer.split("=")[1]
												}`}
												title="trailer"
											/>
										</div>
									) : (
										<div>
											<Typography style={{ fontSize: 23 }} variant="h6">
												Seasons
											</Typography>
											<div>
												<ShowSeasonDetails
													seasons={Object.keys((movie as Show).seasons)}
												/>
											</div>
										</div>
									)}
								</>
							) : (
								<>
									<IconButton
										color="secondary"
										onClick={() => togglePlayOverlay(false)}
									>
										<ArrowBack fontSize="large" />
									</IconButton>
									<Video
										handleStream={() => {
											togglePlayOverlay(true);
											stream((movie as Movie).torrents.en[quality].url);
										}}
										readyToStream={readyToStream}
										loading={loading}
										image={movie.images.fanart}
										handleVideoOnMount={handleVideoOnMount}
									/>
									<div>
										{(loading || readyToStream) && (
											<>
												<div>Status: {torrentInfo.status}</div>
												<div>D:{prettierBytes(torrentInfo.download)}/s</div>
												<div>U:{prettierBytes(torrentInfo.upload)}/s </div>
												<div>P:{(100 * torrentInfo.progress).toFixed(1)}% </div>
											</>
										)}
									</div>
									{isMovie ? (
										<>
											<h3>Select Quality</h3>
											<div>
												{Object.entries((movie as Movie).torrents.en).map(
													([key, torrent]: any) => (
														<TorrentDetails
															onClick={() => updateQuality(key)}
															seeds={torrent.seed}
															peers={torrent.peer}
															size={torrent.filesize}
															res={key}
															selected={quality}
															downloading={Boolean(client.get(torrent.url))}
														/>
													)
												)}
											</div>
										</>
									) : (
										<div style={{ marginTop: 20 }}>
											<Select
												native
												style={{ fontSize: 19 }}
												value={selectedSeason}
												onChange={(e) =>
													updateSelectedSeason(Number(e.target.value))
												}
											>
												{Object.keys((movie as Show).seasons).map((season) => (
													<option value={season}>Season {season}</option>
												))}
											</Select>
											<div style={{ maxHeight: 500, overflowY: "scroll" }}>
												{(movie as Show).seasons[selectedSeason].map(
													(episode: any) => (
														<div style={{ height: 100 }}>{episode.title}</div>
													)
												)}
											</div>
										</div>
									)}
									<div style={{ height: "calc(100vh - 450px)" }}></div>
								</>
							)}
						</Grid>
					</Grid>
				</Paper>
			) : (
				<>
					<br />
					<CircularProgress style={{ display: "block", margin: "auto" }} />
				</>
			)}
		</>
	);
}

const Video = ({
	readyToStream,
	loading,
	handleStream,
	image,
	handleVideoOnMount,
}: {
	readyToStream: boolean;
	loading: boolean;
	handleStream: (e: any) => void;
	image: string;
	handleVideoOnMount: () => void;
}) => {
	useEffect(() => {
		handleVideoOnMount();
	}, [handleVideoOnMount]);
	const classes = useStyles();
	return (
		<div
			style={{
				background: `url(${image})`,
				position: "relative",
				boxShadow: "inset 0 0 0 2000px rgb(1 1 1 / 39%)",
			}}
		>
			<video style={{ width: "100%" }} autoPlay muted id="video" />
			{!readyToStream && !loading ? (
				<IconButton className={classes.videoPlay} onClick={handleStream}>
					<PlayArrowRounded color="secondary" style={{ fontSize: 60 }} />
				</IconButton>
			) : loading ? (
				<CircularProgress className={classes.videoPlay} />
			) : null}
		</div>
	);
};

const sortAndMerge = (a: any) => {
	let aa: any = {};
	for (let i = 0; i < a.length; i++) {
		if (Object.keys(aa).includes(`${a[i].season}`)) {
			aa[a[i].season] = [...aa[a[i].season], a[i]];
		} else {
			aa[a[i].season] = [a[i]];
		}
	}

	Object.keys(aa).map((key) => {
		aa[key] = aa[key].sort((a: any, b: any) => a.episode - b.episode);
	});
	return aa;
};
