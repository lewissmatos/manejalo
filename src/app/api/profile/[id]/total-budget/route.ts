import { getTotalMonthlyBudgetService } from "@/lib/services/profile-services";
import { serviceResponseHandler } from "@/lib/services/utils/actions.utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const profileId = req.nextUrl.searchParams.get("profileId");

	if (!profileId) {
		return NextResponse.json(
			{ error: "Missing required query parameter: profileId." },
			{ status: 400 }
		);
	}
	const res = await serviceResponseHandler(
		async () => await getTotalMonthlyBudgetService(profileId)
	);

	return NextResponse.json(res, { status: res.isSuccess ? 200 : 400 });
}
