import { withTranslator } from "@/i18n/withTranslator";
import { getBudgetCategoriesService } from "@/lib/services/budget-categories-service";
import { getMonthlyIncomesService } from "@/lib/services/monthly-incomes-services";
import { serviceResponseHandler } from "@/lib/services/utils/actions.utils";
import { NextRequest, NextResponse } from "next/server";

const T_NAMESPACE = "ProfilePage.AddIncomeDialog.messages";

export async function GET(req: NextRequest) {
	const profileId = req.nextUrl.searchParams.get("profileId");

	if (!profileId) {
		return NextResponse.json(
			{ error: "Missing required query parameter: profileId." },
			{ status: 400 }
		);
	}
	const res = await serviceResponseHandler(
		async () => await getMonthlyIncomesService(profileId)
	);

	return NextResponse.json(res, { status: res.isSuccess ? 200 : 400 });
}

export async function POST(req: NextRequest) {
	const { t } = await withTranslator(req, T_NAMESPACE);

	const body = await req.json();

	const res = await serviceResponseHandler(
		async () => await getBudgetCategoriesService(body),
		{
			successMessage: t("defaultSuccessMessage"),
			errorMessage: t("defaultErrorMessage"),
		}
	);

	return NextResponse.json(res, { status: res.isSuccess ? 200 : 400 });
}
