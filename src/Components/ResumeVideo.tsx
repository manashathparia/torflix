import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { makeStyles, Snackbar, Button, IconButton } from "@material-ui/core";
import { RootState } from "../Redux/Reducers";
import { Close } from "@material-ui/icons";
import { Redirect } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
	close: {
		padding: theme.spacing(0.5),
	},
}));

export default function ResumeVideo(props: any) {
	const currentlyViewing = useSelector(
		(state: RootState) => state.content.currentlyViewing
	);
	const [show, toggleSnackbar] = useState(false);
	useEffect(() => {
		toggleSnackbar(Boolean(currentlyViewing.title));
	}, [currentlyViewing.title]);

	const classes = useStyles();
	return (
		<Snackbar
			open={show}
			message={"Deadpool"}
			action={
				<>
					<Button
						onClick={() =>
							props.push(`/movie/${currentlyViewing.id}/?resume=true`)
						}
					>
						RESUME
					</Button>
					<IconButton className={classes.close}>
						<Close color="secondary" />
					</IconButton>
				</>
			}
		></Snackbar>
	);
}
