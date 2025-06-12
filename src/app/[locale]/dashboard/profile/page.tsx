import React from "react";
import { getTranslations } from "next-intl/server";
import dynamic from "next/dynamic";
const ProfileInfoSection = dynamic(
	() => import("./_components/profile-info-section"),
	{ ssr: !!false }
);

const Profile = async () => {
	const t = await getTranslations("ProfilePage");

	return (
		<section id="profile-page" className="flex flex-col justify-center">
			<ProfileInfoSection />
		</section>
	);
};

export default Profile;
