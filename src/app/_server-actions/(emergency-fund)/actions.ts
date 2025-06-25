import {getEmergencyFundService} from "@/lib/services/emergency-fund-services";
import {serviceResponseHandler} from "@/lib/services/utils/actions.utils";

export const getEmergencyFund = async (profileId: string) => await serviceResponseHandler(async () => await getEmergencyFundService(profileId));