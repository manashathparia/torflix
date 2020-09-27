import React from "react";
import Chip from "@material-ui/core/Chip";
import CloudDownload from "@material-ui/icons/CloudDownload";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles({
	root: {
		borderRadius: 10,
		margin: "auto 10",
		background: "rgb(36 35 35 / 93%)",
		cursor: "pointer",
		border: (props: any) =>
			props.selected ? "2px solid #b6b0b0" : "2px solid #303030",
		marginBottom: "10px",
		padding: "5px",
		position: "relative",
	},
	qualityButtons: {
		padding: "5px",
		borderRadius: "3px",
		cursor: "pointer",
		margin: "auto",
		color: "#e71616",
		textAlign: "center",
	},
	chip: {
		margin: "auto",
		width: "70%",
		marginTop: "5px",
		color: "white",
		background: "#41404061",
		cursor: "inherit",
	},
	downloadIcon: {
		position: "absolute",
		left: 10,
	},
});

interface Props {
	res: string;
	seeds: number;
	peers: number;
	size: string;
	selected: string;
	downloading: boolean;
	onClick: Function;
}

export default function TorrentDetails(props: Props) {
	const classes = useStyles({ selected: props.selected === props.res });
	return (
		<div onClick={() => props.onClick()} className={classes.root}>
			{props.downloading ? (
				<CloudDownload className={classes.downloadIcon} />
			) : null}
			<div className={classes.qualityButtons}>{props.res}</div>
			<div style={{ display: "flex" }}>
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
