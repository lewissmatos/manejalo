import { withTranslator } from "@/i18n/withTranslator";
import { setBudgetCategoryStatusService } from "@/lib/services/budget-categories-service";
import { setMonthlyIncomeStatusService } from "@/lib/services/monthly-incomes-services";
import { serviceResponseHandler } from "@/lib/services/utils/actions.utils";
import { NextRequest, NextResponse } from "next/server";

const T_NAMESPACE = "ProfilePage.AddIncomeDialog.messages";

export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { t } = await withTranslator(req, T_NAMESPACE);

	const body = await req.json();
	const newStatus = body.newStatus;
	if (typeof newStatus !== "boolean") {
		return NextResponse.json(
			{ error: "Invalid status value" },
			{ status: 400 }
		);
	}

	const { id } = await params;

	const res = await serviceResponseHandler(
		async () => await setMonthlyIncomeStatusService(id, newStatus),
		{
			successMessage: newStatus
				? t("setMonthlyIncomeStatusSuccessMessage")
				: t("setMonthlyIncomeStatusErrorMessage"),
		}
	);

	return NextResponse.json(res, { status: res.isSuccess ? 200 : 400 });
}
