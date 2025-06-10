import React from "react";

const ScreenTitle = ({ children }: { children: React.ReactNode }) => {
	return <h2 className="text-2xl text-primary font-semibold">{children}</h2>;
};

export default ScreenTitle;
