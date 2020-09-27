import React, { useEffect } from "react";
import createTheme from "@material-ui/core/styles/createMuiTheme";
import Webtorrent from "webtorrent";
import Header from "./Components/Header";
import Pages from "./Pages";
import Content from "./Components/Content";
import { MuiThemeProvider } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { loadFavMovies } from "./Redux/Actions/contentActions";
import ResumeVideo from "./Components/ResumeVideo";

function App() {
	const theme = createTheme({
		palette: {
			primary: {
				main: "#cd2c2c",
			},
			secondary: {
				main: "#ffffff",
			},
			text: {
				primary: "#dfd9d9",
				secondary: "#221f1f",
			},
		},
		typography: {
			fontFamily: "'Nunito', sans-serif'",
		},
	});

	const dispatch = useDispatch();

	const client: Webtorrent.Instance = React.useMemo(() => {
		return new Webtorrent();
	}, []);

	useEffect(() => {
		dispatch(loadFavMovies());
		return () => localStorage.removeItem("POS"); // refer to CurrentlyViewing.tsx:204
	}, [dispatch]);

	return (
		<div className="App" style={{ minHeight: "100vh" }}>
			<MuiThemeProvider theme={theme}>
				<Header />
				<Content>
					<Pages client={client} />
				</Content>
			</MuiThemeProvider>
		</div>
	);
}

export default App;
