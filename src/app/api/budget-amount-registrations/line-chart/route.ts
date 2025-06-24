import { getTotalBudgetAmountRegistrationPerYearForLineChart } from "@/app/_server-actions/(budget-amount-registrations)/actions";
import { getBudgetAmountRegistrationHistoryService } from "@/lib/services/budget-amount-registrations-service";
import { serviceResponseHandler } from "@/lib/services/utils/actions.utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const profileId = req.nextUrl.searchParams.get("profileId");
	const year = req.nextUrl.searchParams.get("year");

	if (!profileId || !year) {
		return NextResponse.json(
			{ error: "Missing required query parameters: profileId, year." },
			{ status: 400 }
		);
	}
	const res = await serviceResponseHandler(() =>
		getTotalBudgetAmountRegistrationPerYearForLineChart({
			profileId,
			year: year ? parseInt(year) : new Date().getFullYear(),
		})
	);

	return NextResponse.json(res, { status: res.isSuccess ? 200 : 400 });
}
