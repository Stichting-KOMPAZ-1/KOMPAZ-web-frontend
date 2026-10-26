import ButtonLink from "components/button/button-link";
import { Heading } from "components/heading/heading";
import * as m from "lib/paraglide/messages";

import style from "./page-not-found.module.scss";

const PageNotFound = () => (
	<div className={style.page}>
		<div className={style.text}>
			<Heading el="h1" size="24-32">
				{m.not_found_title()}
			</Heading>
			<p>{m.not_found_body()}</p>
		</div>

		<ButtonLink to="/">{m.not_found_home()}</ButtonLink>
	</div>
);

export default PageNotFound;
