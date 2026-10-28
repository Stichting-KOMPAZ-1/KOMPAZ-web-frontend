import Button from "components/button/button";
import PageMessage from "components/page/page-message";
import * as m from "lib/paraglide/messages";

const renderErrorFallback = () => (
	<PageMessage
		title={m.error_page_title()}
		body={m.error_page_body()}
		role="alert"
	>
		<Button onClick={() => window.location.reload()}>
			{m.error_page_reload()}
		</Button>
	</PageMessage>
);

export default renderErrorFallback;
