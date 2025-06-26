import {
	addEmergencyFundService,
	getEmergencyFundService,
} from "@/lib/services/emergency-fund-services";
import { serviceResponseHandler } from "@/lib/services/utils/actions.utils";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
	const profileId = await req.nextUrl.searchParams.get("profileId");
	if (!profileId) {
		return NextResponse.json(
			{ error: "Missing required query parameter: profileId." },
			{ status: 400 }
		);
	}
	const res = await serviceResponseHandler(
		async () => await getEmergencyFundService(profileId)
	);

	return NextResponse.json(res, { status: res.isSuccess ? 200 : 400 });
};

export const POST = async (req: NextRequest) => {
	const body = await req.json();

	const res = await serviceResponseHandler(
		async () => await addEmergencyFundService(body)
	);

	return NextResponse.json(res, { status: res.isSuccess ? 200 : 400 });
};
