import React from "react";
import Chip from "@material-ui/core/Chip";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles({
	root: {
		width: 170,
		height: 170,
		borderRadius: 10,
		margin: 10,
		background: "rgb(36 35 35 / 93%)",
		cursor: "pointer",
	},
	qualityButtons: {
		padding: "5px",
		borderRadius: "3px",
		cursor: "pointer",
		margin: 5,
		color: "#e71616",
		textAlign: "center",
		marginTop: 10,
	},
	chip: {
		margin: "auto",
		display: "flex",
		width: "70%",
		marginTop: "5px",
		color: "white",
		background: "#41404061",
		cursor: "inherit",
	},
});

interface Props {
	res: string;
	seeds: number;
	peers: number;
	size: string;
}

export default function TorrentDetails(props: Props) {
	const classes = useStyles();
	return (
		<div className={classes.root}>
			<div className={classes.qualityButtons}>{props.res}</div>
			<div>
				<Chip className={classes.chip} label={`${props.size}`}></Chip>
				<Chip
					style={{ color: "#a6e0c4" }}
					className={classes.chip}
					label={`${props.seeds} seeds`}
				></Chip>
				<Chip
					className={classes.chip}
					style={{ color: "#dd766c" }}
					label={`${props.peers} peers`}
				></Chip>
			</div>
		</div>
	);
}
