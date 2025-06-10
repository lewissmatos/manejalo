import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai/vanilla";
type AppFiltersAtom = {
	selectedDate: Date | null;
};
const initialState: AppFiltersAtom = {
	selectedDate: new Date(),
};
export const appFiltersAtom = atomWithStorage("app-filters", initialState);

export const selectedDateAtom = atom(
	(get) => get(appFiltersAtom).selectedDate,
	(get, set, newDate: Date | null) => {
		const prev = get(appFiltersAtom);
		set(appFiltersAtom, { ...prev, selectedDate: newDate });
	}
);
