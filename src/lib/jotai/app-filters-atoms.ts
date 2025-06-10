import { locales } from "@/app/[locale]/dashboard/_components/AppSideCalendar";
import { format, setDefaultOptions } from "date-fns";
import { es } from "date-fns/locale";
import { atomWithStorage, loadable } from "jotai/utils";
import { atom } from "jotai/vanilla";
import { Locale } from "next-intl";
type AppFiltersAtom = {
	selectedDate: Date | null;
};
const initialState: AppFiltersAtom = {
	selectedDate: new Date(),
};
export const appFiltersAtom = atomWithStorage("app-filters", initialState);

export const setSelectedDateAtom = atom(
	(get) => get(appFiltersAtom).selectedDate,
	(get, set, newDate: Date | null) => {
		const prev = get(appFiltersAtom);
		set(appFiltersAtom, { ...prev, selectedDate: newDate });
	}
);
