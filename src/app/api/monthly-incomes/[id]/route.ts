import { withTranslator } from "@/i18n/withTranslator";
import {
	deleteMonthlyIncomeService,
	updateMonthlyIncomeService,
} from "@/lib/services/monthly-incomes-services";
import { serviceResponseHandler } from "@/lib/services/utils/actions.utils";
import { NextRequest, NextResponse } from "next/server";

const T_NAMESPACE = "ProfilePage.AddIncomeDialog.messages";
export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { t } = await withTranslator(req, T_NAMESPACE);

	const body = await req.json();
	const { id } = await params;

	const res = await serviceResponseHandler(
		async () => await updateMonthlyIncomeService(id, body),
		{
			successMessage: t("updateSuccessMessage"),
			errorMessage: t("defaultErrorMessage"),
		}
	);

	return NextResponse.json(res, { status: res.isSuccess ? 200 : 400 });
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { t } = await withTranslator(req, T_NAMESPACE);
	const { id } = await params;

	const res = await serviceResponseHandler(
		async () => await deleteMonthlyIncomeService(id),
		{
			successMessage: t("deleteSuccessMessage"),
			errorMessage: t("deleteErrorMessage"),
		}
	);

	return NextResponse.json(res, { status: res.isSuccess ? 200 : 400 });
}
