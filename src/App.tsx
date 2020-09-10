import React from "react";
import Header from "./Components/Header";
import Pages from "./Pages";
import Content from "./Components/Content";

function App() {
	return (
		<div className="App">
			<Header />
			<Content>
				<Pages />
			</Content>
		</div>
	);
}

export default App;
