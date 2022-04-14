import {
	ShowState,
	Show,
	ADD_SHOWS,
	UPDATE_CURRENTLY_VIEWING,
	NEXT_PAGE,
	TOGGLE_FAVORITE_MOVIE,
} from "./types";

const initial: ShowState = {
	showsList: [],
	currentlyViewing: {},
	page: 1,
	favorites: [],
};

type Payload =
	| Show
	| Array<Show>
	| string[]
	| { url?: string; position?: number };

export default function moviesReducer(
	state = initial,
	{ type, payload }: { type: string; payload: Payload }
): ShowState {
	switch (type) {
		case ADD_SHOWS:
			return {
				...state,
				showsList: [...state.showsList, ...(payload as Array<Show>)],
			};

		case UPDATE_CURRENTLY_VIEWING:
			return { ...state, currentlyViewing: payload as {} };

		case NEXT_PAGE:
			return { ...state, page: state.page + 1 };

		case TOGGLE_FAVORITE_MOVIE:
			return { ...state, favorites: [...(payload as Array<string>)] };

		default:
			return state;
	}
}
