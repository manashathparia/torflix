import React, { useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "../icons/search";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Menu from "./Menu";
import BackIcon from "../icons/BackIcon";
import CloseIcon from "../icons/closeIcon";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		position: "sticky",
		top: 0,
		zIndex: 9,
		[theme.breakpoints.up("sm")]: {
			zIndex: 999,
		},
	},
	title: {
		color: "white",
		textDecoration: "none",
		[theme.breakpoints.down("sm")]: {
			flexGrow: 1,
		},
	},
	appBar: {
		boxShadow: "none",
		// position: "fixed",
		// bacskground: "#181b20",
		background:
			"linear-gradient(to bottom, #191c21c7 0%, rgb(34 31 31 / 0%) 100%) !important",
		top: 0,
		[theme.breakpoints.up("sm")]: {
			paddingLeft: "100px",
			paddingRight: "100px",
		},
	},
	menuAlt: {
		background:
			"linear-gradient(to bottom, #1c1b1bd6 0%, rgb(34 31 31 / 0%) 100%) !important",
		position: "absolute",
		zIndex: 1,
		width: "100%",
	},
	menuButton: {
		padding: "5px",
		background: "none",
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
		color: "inherit",
		textDecoration: "none",
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
	const [searchOpen, toggleSearch] = React.useState(false);
	const [currentCategory, updateCategory] = React.useState("movies");
	const [scrollState, updateScrollState] = React.useState({
		prevScrollpos: window.pageYOffset,
		visible: true,
	});

	const history = useHistory();

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

	React.useEffect(() => {
		const cat = document.location.pathname.split("/")[1];
		console.log(cat);
		if (cat.includes("movie")) {
			updateCategory("Movies");
		} else {
			updateCategory("Shows");
		}
	}, []);

	const onSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			history.push(`/search/${(e.target as HTMLTextAreaElement).value}`);
		}
	};

	const InputComp = () => (
		<InputBase
			placeholder={`Search for ${currentCategory}`}
			classes={{
				root: classes.inputRoot,
				input: classes.inputInput,
			}}
			inputProps={{ "aria-label": "search" }}
			onKeyPress={onSearch}
			// onChange={(e) => setSearchVal(e.target.value)}
			//			value={searchVal}
		/>
	);

	return (
		<>
			<div className={classes.root}>
				<AppBar position="static" className={classes.appBar} color="primary">
					<Toolbar>
						{!searchOpen ? (
							<>
								{" "}
								<Link to="/" className={classes.title}>
									<Typography variant="h6">TORFLIX</Typography>
								</Link>
								<IconButton
									onClick={() => toggleSearch(!searchOpen)}
									className={classes.mobileSearch}
								>
									<SearchIcon />
								</IconButton>
								<div className={classes.search}>
									<div>
										<div className={classes.searchIcon}>
											<SearchIcon />
										</div>
										<InputComp />
									</div>
								</div>
								{/* <Link
									onClick={() => updateCategory("Movies")}
									to="/movies"
									className={classes.buttonsContainer}
								>
									<Button color="inherit">Movies</Button>
								</Link>
								<Link
									onClick={() => updateCategory("Shows")}
									to="/shows"
									className={classes.buttonsContainer}
								>
									<Button color="inherit">Shows</Button>
								</Link> */}
							</>
						) : (
							<>
								<InputComp />
								<IconButton
									onClick={() => toggleSearch(!searchOpen)}
									style={{ color: "white" }}
								>
									<CloseIcon />
								</IconButton>
							</>
						)}
					</Toolbar>
				</AppBar>
			</div>
			<div style={{ height: 20 }}></div>

			<Menu onClose={() => toggleMenu(!menuOpen)} open={menuOpen} />
		</>
	);
}
export const HeaderAlt = ({ history }: any) => {
	const classes = useStyles();
	return (
		<div className={classes.root}>
			<div className={`${classes.appBar} ${classes.menuAlt}`}>
				<span onClick={() => history.goBack()}>
					<BackIcon style={{ fontSize: 37, padding: 10 }} />
				</span>
			</div>
		</div>
	);
};
