import React, { useState } from "react";
import Chip from "@material-ui/core/Chip";
import CloudDownload from "@material-ui/icons/CloudDownload";
import MoreVert from "@material-ui/icons/MoreVert";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { IconButton, Menu, MenuItem } from "@material-ui/core";

const useStyles = makeStyles({
	root: {
		borderRadius: 10,
		margin: "auto 10",
		background: "rgb(36 35 35 / 93%)",
		border: (props: any) =>
			props.selected ? "2px solid #b6b0b0" : "2px solid #303030",
		marginBottom: "10px",
		padding: "5px",
		position: "relative",
		"& *": {
			userSelect: "none",
		},
	},
	qualityButtons: {
		padding: "5px",
		borderRadius: "3px",
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
	optionIcon: {
		position: "absolute",
		top: -3,
		right: 0,
	},
	menuPaper: {
		backgroundColor: "#221f1f",
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
	onPlay?: (e: React.MouseEvent) => void;
	onPause?: (e: React.MouseEvent) => void;
	onStop?: (e: React.MouseEvent) => void;
}

export default function TorrentDetails(props: Props) {
	const [anchorEl, setAnchorEl] = useState<any>(null);
	const [menuOpen, toggleMenu] = useState(false);

	const handleOptionClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setAnchorEl(e.target);
		toggleMenu(!menuOpen);
	};

	const classes = useStyles({ selected: props.selected === props.res });
	return (
		<div onClick={() => props.onClick()} className={classes.root}>
			{props.downloading && <CloudDownload className={classes.downloadIcon} />}
			<div className={classes.qualityButtons}>{props.res}</div>
			<IconButton onClick={handleOptionClick} className={classes.optionIcon}>
				<MoreVert color="secondary" />
			</IconButton>
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
			<Menu
				open={menuOpen}
				onClose={handleOptionClick}
				anchorEl={anchorEl}
				onClick={handleOptionClick}
				classes={{ paper: classes.menuPaper }}
			>
				<MenuItem onClick={props.onPlay}>Play</MenuItem>
				<MenuItem onClick={props.onPause} disabled={!props.downloading}>
					Pause downloading
				</MenuItem>
				<MenuItem onClick={props.onStop} disabled={!props.downloading}>
					Stop downloading
				</MenuItem>
			</Menu>
		</div>
	);
}
