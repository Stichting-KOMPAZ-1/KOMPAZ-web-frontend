import { createFileRoute, redirect } from "@tanstack/react-router";

// TODO: KOM-110 decides whether the QR code encodes the share URL with UTM parameters instead
export const Route = createFileRoute(
	"/delen/$organizationSlug/qr/$eLearningSlug",
)({
	beforeLoad: ({ params }) => {
		throw redirect({
			to: "/delen/$organizationSlug/$eLearningSlug",
			params,
			search: { utm_source: "qr", utm_medium: "qr" },
			replace: true,
		});
	},
});
