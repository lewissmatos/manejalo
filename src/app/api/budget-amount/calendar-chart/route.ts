import { getTotalAmountRegistrationsForCalendarChartService } from "@/lib/services/budget-amount-registration-service";
import { serviceResponseHandler } from "@/lib/services/utils/actions.utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const profileId = req.nextUrl.searchParams.get("profileId");
	const year = req.nextUrl.searchParams.get("year");

	if (!profileId || !year) {
		return NextResponse.json(
			{ error: "Missing required query parameters." },
			{ status: 400 }
		);
	}
	const res = await serviceResponseHandler(() =>
		getTotalAmountRegistrationsForCalendarChartService({
			profileId,
			year: parseInt(year),
		})
	);

	return NextResponse.json(res, { status: res.isSuccess ? 200 : 400 });
}
