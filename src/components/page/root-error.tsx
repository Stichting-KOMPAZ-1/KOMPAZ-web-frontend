import { type ErrorComponentProps, useRouter } from "@tanstack/react-router";
import Button from "components/button/button";
import ButtonLink from "components/button/button-link";
import * as m from "lib/paraglide/messages";

import PageMessage from "./page-message";

const RootError = ({ reset }: ErrorComponentProps) => {
	const router = useRouter();

	return (
		<PageMessage
			title={m.error_page_title()}
			body={m.error_page_body()}
			role="alert"
		>
			<Button
				onClick={() => {
					reset();
					void router.invalidate();
				}}
			>
				{m.error_page_retry()}
			</Button>
			<ButtonLink to="/" variant="secondary">
				{m.error_page_home()}
			</ButtonLink>
		</PageMessage>
	);
};

export default RootError;
