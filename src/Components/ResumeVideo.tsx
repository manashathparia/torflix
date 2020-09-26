import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/Reducers";

export default function ResumeVideo() {
	const currentlyViewing = useSelector(
		(state: RootState) => state.content.currentlyViewing
	);
	return (
		<div>
			<span>{currentlyViewing.title}</span>
			<span>{currentlyViewing.position}</span>
			<span>{currentlyViewing.magnetURI}</span>
		</div>
	);
}
