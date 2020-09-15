import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import MenuIcon from "@material-ui/icons/Menu";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		position: "sticky",
		top: 0,
		zIndex: 9,
	},
	title: {
		color: "white",
		textDecoration: "none",
		[theme.breakpoints.down("sm")]: {
			flexGrow: 1,
		},
	},
	appBar: {
		boxShadow: "0 2px 43px -4px rgb(0 0 0 / 12%)",
		position: "relative",
		top: 0,
		[theme.breakpoints.up("sm")]: {
			paddingLeft: "100px",
			paddingRight: "100px",
		},
	},
	menuButton: {
		border: "1px solid rgb(114 108 108 / 15%)",
		borderRadius: "4px",
		padding: "5px",
		background: "rgb(215 213 213 / 20%)",
		marginRight: theme.spacing(2),
		"&:hover": {
			background: "rgb(166 160 160 / 20%)",
		},
		marginLeft: "0",
	},
	search: {
		position: "relative",
		borderRadius: theme.shape.borderRadius,
		marginLeft: 0,
		width: "100%",
		backgroundColor: "#f2f2f2",
		color: "#454242",
		display: "none",
		[theme.breakpoints.up("sm")]: {
			margin: "0 300px 0 45px",
			width: "auto",
			flexGrow: 1,
			display: "block",
		},
	},
	searchIcon: {
		padding: theme.spacing(0, 2),
		height: "100%",
		position: "absolute",
		pointerEvents: "none",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		right: 0,
	},
	inputRoot: {
		color: "inherit",
		width: "100%",
	},
	inputInput: {
		padding: theme.spacing(1, 1, 1, 0),
		paddingLeft: "1em",
		width: "100%",
	},
	buttonsContainer: {
		[theme.breakpoints.down("sm")]: {
			display: "none",
		},
	},
	mobileSearch: {
		[theme.breakpoints.up("sm")]: {
			display: "none",
		},
		color: "white",
		"& svg": {
			fontSize: "23px",
		},
	},
	miniCategoriesBar: {
		width: "100%",
		height: "35px",
		background: "white",
		whiteSpace: "nowrap",
		overflowX: "auto",
		paddingTop: 4,
		textAlign: "center",
		position: "relative",
		top: 0,
		transition: "top 0.2s",
	},
	miniCategoriesBarHidden: {
		top: "-40px !important",
	},
	miniBarItem: {
		verticalAlign: "sub",
		fontSize: "15px",
		fontFamily: "system-ui",
		fontWeight: 400,
		padding: "12px 30px 9px",
		display: "inline",
		"& a": {
			textDecoration: "none",
			color: "#625e5e",
		},
	},
}));

export default function Header() {
	const classes = useStyles();
	const [menuOpen, toggleMenu] = React.useState(false);
	const [scrollState, updateScrollState] = React.useState({
		prevScrollpos: window.pageYOffset,
		visible: true,
	});

	const handleScroll = () => {
		const { prevScrollpos } = scrollState;

		const currentScrollPos = window.pageYOffset;
		const visible = prevScrollpos > currentScrollPos;

		updateScrollState({
			prevScrollpos: currentScrollPos,
			visible,
		});
	};

	React.useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	});

	return (
		<>
			<div className={classes.root}>
				<AppBar position="static" className={classes.appBar} color="primary">
					<Toolbar>
						<IconButton
							edge="start"
							className={classes.menuButton}
							color="inherit"
							aria-label="menu"
							disableRipple
							onClick={() => toggleMenu(!menuOpen)}
						>
							<MenuIcon />
						</IconButton>
						<Link to="/" className={classes.title}>
							<Typography variant="h6">TORFLIX</Typography>
						</Link>
						<IconButton className={classes.mobileSearch}>
							<SearchIcon />
						</IconButton>
						<div className={classes.search}>
							<div>
								<div className={classes.searchIcon}>
									<SearchIcon />
								</div>
								<InputBase
									placeholder="Search for Movies or Shows"
									classes={{
										root: classes.inputRoot,
										input: classes.inputInput,
									}}
									inputProps={{ "aria-label": "search" }}
								/>
							</div>
						</div>
						<div className={classes.buttonsContainer}>
							<Button color="inherit">Movies</Button>
						</div>
						<div className={classes.buttonsContainer}>
							<Button color="inherit">Shows</Button>
						</div>
					</Toolbar>
				</AppBar>
			</div>
		</>
	);
}
