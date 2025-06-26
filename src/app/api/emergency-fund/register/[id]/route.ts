import { withTranslator } from "@/i18n/withTranslator";
import {
	deleteBudgetCategoryService,
	updateBudgetCategoryService,
} from "@/lib/services/budget-categories-service";
import {
	addAmountToEmergencyFundService,
	setEmergencyFundStatusService,
} from "@/lib/services/emergency-fund-services";
import { serviceResponseHandler } from "@/lib/services/utils/actions.utils";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { t } = await withTranslator(req, "MyBudgetPage.messages");

	const body = await req.json();
	const newStatus = body?.newStatus;
	const { id } = await params;
	if (!id) {
		return NextResponse.json(
			{ error: "Missing required query parameter: id." },
			{ status: 400 }
		);
	}

	if (typeof newStatus !== "boolean") {
		return NextResponse.json(
			{ error: "Invalid status value" },
			{ status: 400 }
		);
	}

	const res = await serviceResponseHandler(
		async () => await setEmergencyFundStatusService(id, newStatus)
	);

	return NextResponse.json(res, { status: res.isSuccess ? 200 : 400 });
}

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { t } = await withTranslator(req, "MyBudgetPage.messages");
	const { id } = await params;
	const body = await req.json();
	const { type, amount } = body || {};

	if (!id) {
		return NextResponse.json(
			{ error: "Missing required query parameter: id." },
			{ status: 400 }
		);
	}

	if (!["add", "subtract"].includes(type)) {
		return NextResponse.json(
			{ error: "Invalid status value" },
			{ status: 400 }
		);
	}
	const res = await serviceResponseHandler(
		async () =>
			await addAmountToEmergencyFundService(
				id,
				type === "add" ? Number(amount) : Number(amount) * -1
			),
		{
			successMessage: t("deleteSuccessMessage"),
			errorMessage: t("deleteErrorMessage"),
		}
	);

	return NextResponse.json(res, { status: res.isSuccess ? 200 : 400 });
}
