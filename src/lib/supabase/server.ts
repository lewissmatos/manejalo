import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createServerSupabaseClient() {
	const cookieStore = await cookies();
	return createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll: async () => await cookieStore.getAll(),
				setAll: (c) =>
					c.forEach((cookie) => {
						cookieStore.set(cookie.name, cookie.value, cookie.options);
					}),
			},
		}
	);
}
