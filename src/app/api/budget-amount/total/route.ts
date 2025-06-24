import {
	getBudgetAmountRegistrationHistoryService,
	getTotalBudgetAmountRegistrationByDateRangeService,
} from "@/lib/services/budget-amount-registration-service";
import { serviceResponseHandler } from "@/lib/services/utils/actions.utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const profileId = req.nextUrl.searchParams.get("profileId");
	const startDate = req.nextUrl.searchParams.get("startDate");
	const endDate = req.nextUrl.searchParams.get("endDate");

	if (!profileId || !startDate || !endDate) {
		return NextResponse.json(
			{
				error:
					"Missing required query parameters: profileId, startDate, endDate",
			},
			{ status: 400 }
		);
	}
	const res = await serviceResponseHandler(() =>
		getTotalBudgetAmountRegistrationByDateRangeService({
			profileId,
			startDate: new Date(startDate),
			endDate: new Date(endDate),
		})
	);

	return NextResponse.json(res, { status: res.isSuccess ? 200 : 400 });
}
