import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { makeStyles, Snackbar, Button, IconButton } from "@material-ui/core";
import { RootState } from "../Redux/Reducers";
import { Close } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
	close: {
		padding: theme.spacing(0.5),
	},
}));

export default function ResumeVideo(props: any) {
	const currentlyViewing = useSelector(
		(state: RootState) => state.movies.currentlyViewing
	);
	const [show, toggleSnackbar] = useState(false);
	useEffect(() => {
		toggleSnackbar(Boolean(currentlyViewing.title));
	}, [currentlyViewing.title]);

	const hideSnackBar = () => {
		toggleSnackbar(false);
	};

	const classes = useStyles();
	return (
		<Snackbar
			open={show}
			message={currentlyViewing.title}
			action={
				<>
					<Button
						onClick={() =>
							props.push(`/movie/${currentlyViewing.id}/?resume=true`)
						}
					>
						RESUME
					</Button>
					<IconButton onClick={hideSnackBar} className={classes.close}>
						<Close color="secondary" />
					</IconButton>
				</>
			}
		></Snackbar>
	);
}
