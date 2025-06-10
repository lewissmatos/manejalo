import React from "react";
import ScreenTitle from "../_components/screen-title";
import { getTranslations } from "next-intl/server";
import dynamic from "next/dynamic";
const ProfileInfoSection = dynamic(
	() => import("./_components/profile-info-section"),
	{ ssr: !!false }
);

const Profile = async () => {
	const t = await getTranslations("ProfilePage");
	return (
		<section id="profile-page" className="flex flex-col  justify-center">
			<div className="flex flex-col items-center justify-center w-full max-w-3xl">
				<ProfileInfoSection />
			</div>
		</section>
	);
};

export default Profile;
