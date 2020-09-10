import React from "react";
import createTheme from "@material-ui/core/styles/createMuiTheme";
import Header from "./Components/Header";
import Pages from "./Pages";
import Content from "./Components/Content";
import { MuiThemeProvider } from "@material-ui/core";

function App() {
	const theme = createTheme({
		palette: {
			primary: {
				main: "#cd2c2c",
			},
			text: {
				primary: "#ffffff",
			},
		},
	});

	return (
		<div className="App" style={{ height: "auto" }}>
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
