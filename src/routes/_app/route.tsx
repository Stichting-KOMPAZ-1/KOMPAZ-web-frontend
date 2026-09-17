import { createFileRoute } from "@tanstack/react-router";
import AppLayout from "layouts/app-layout/app-layout";

export const Route = createFileRoute("/_app")({
	component: AppLayout,
});
