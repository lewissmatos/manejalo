import { MonthlyIncome, Profile } from "@/generated/prisma";
import { User } from "@supabase/supabase-js";
import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai/vanilla";
export type ProfileWithIncomes = Profile & { incomes: MonthlyIncome[] };
type AuthAtom = {
	isAuthenticated: boolean;
	profile: ProfileWithIncomes | null;
	user: User | null;
	totalMonthlyIncome?: number;
};
const initialAuthState: AuthAtom = {
	isAuthenticated: false,
	profile: null,
	user: null,
	totalMonthlyIncome: 0,
};

export const authAtom = atomWithStorage("auth", initialAuthState);

export const updateProfileDataAtom = atom(
	(get) => get(authAtom).profile,
	(get, set, newProfileData: Partial<ProfileWithIncomes>) => {
		const currentAuth = get(authAtom);
		set(authAtom, {
			...currentAuth,
			profile: {
				...currentAuth?.profile,
				...newProfileData,
			} as ProfileWithIncomes,
			totalMonthlyIncome: newProfileData.totalMonthlyIncome || 0,
		});
	}
);

export const logoutAtom = atom(null, (_, set) => {
	set(authAtom, initialAuthState);
});
