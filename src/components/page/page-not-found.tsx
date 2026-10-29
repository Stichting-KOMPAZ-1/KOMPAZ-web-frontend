import ButtonLink from "components/button/button-link";
import * as m from "lib/paraglide/messages";

import PageMessage from "./page-message";

const PageNotFound = () => (
	<PageMessage title={m.not_found_title()} body={m.not_found_body()}>
		<ButtonLink to="/">{m.not_found_home()}</ButtonLink>
	</PageMessage>
);

export default PageNotFound;
