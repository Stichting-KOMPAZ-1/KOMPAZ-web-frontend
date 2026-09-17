import { createFileRoute } from "@tanstack/react-router";
import AppLayout from "layouts/app-layout/app-layout";

// No route guard: the app has no authentication for now.
// When it returns, this is where it goes — a beforeLoad that resolves the
// current user and redirects to /login on failure, preserving the `redirect`
// search param the login route already validates.
export const Route = createFileRoute("/_app")({
	component: AppLayout,
});
