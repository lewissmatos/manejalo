import { Profile } from "@/generated/prisma";
import { User } from "@supabase/supabase-js";
import { atomWithStorage } from "jotai/utils";
type AuthAtom = {
	isAuthenticated: boolean;
	profile: Profile | null;
	user: User | null;
};
const initialAuthState: AuthAtom = {
	isAuthenticated: false,
	profile: null,
	user: null,
};

export const authAtom = atomWithStorage("auth", initialAuthState);
