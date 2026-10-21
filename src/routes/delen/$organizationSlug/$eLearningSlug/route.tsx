import { createFileRoute } from "@tanstack/react-router";
import Header from "components/header/header";
import AppLayout from "layouts/app-layout/app-layout";

export const Route = createFileRoute("/delen/$organizationSlug/$eLearningSlug")(
	{
		// TODO: KOM-110 passes the sharing organization to the header
		component: () => <AppLayout header={<Header />} />,
	},
);
