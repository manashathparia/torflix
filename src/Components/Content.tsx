import React from "react";
import Paper from "@material-ui/core/Paper";

export default function Content({ children }: { children: JSX.Element }) {
	return (
		<Paper
			style={{
				backgroundColor: "#221f1f",
				padding: "20px",
				borderRadius: 0,
				height: "85%",
			}}
		>
			{children}
		</Paper>
	);
}
