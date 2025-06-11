import { MonthlyIncome, Profile } from "@/generated/prisma";
import { User } from "@supabase/supabase-js";
import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai/vanilla";
export type ProfileWithIncomes = Profile & { incomes: MonthlyIncome[] };
type AuthAtom = {
	isAuthenticated: boolean;
	profile: ProfileWithIncomes | null;
	user: User | null;
	profileTotalMonthlyIncome?: number;
};
const initialAuthState: AuthAtom = {
	isAuthenticated: false,
	profile: null,
	user: null,
	profileTotalMonthlyIncome: undefined,
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
			profileTotalMonthlyIncome: newProfileData.incomes
				? newProfileData.incomes.reduce((sum, income) => sum + income.amount, 0)
				: currentAuth.profileTotalMonthlyIncome,
		});
	}
);

export const logoutAtom = atom(null, (_, set) => {
	set(authAtom, initialAuthState);
});
