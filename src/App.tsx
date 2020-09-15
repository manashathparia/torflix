import React, { useEffect } from "react";
import createTheme from "@material-ui/core/styles/createMuiTheme";
import Header from "./Components/Header";
import Pages from "./Pages";
import Content from "./Components/Content";
import { MuiThemeProvider } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { loadFavMovies } from "./Redux/Actions/contentActions";

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
				primary: "#ffffff",
				secondary: "#221f1f",
			},
		},
	});

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(loadFavMovies());
	}, [dispatch]);

	return (
		<div className="App" style={{ minHeight: "100vh" }}>
			<MuiThemeProvider theme={theme}>
				<Header />
				<Content>
					<Pages />
				</Content>
			</MuiThemeProvider>
		</div>
	);
}

export default App;
