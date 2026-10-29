import { Heading } from "components/heading/heading";
import type React from "react";

import style from "./page-message.module.scss";

type Props = {
	title: string;
	body: string;
	role?: "alert";
	children: React.ReactNode;
};

const PageMessage = ({ title, body, role, children }: Props) => (
	<div className={style.page}>
		<div className={style.text} role={role}>
			<Heading el="h1" size="24-32">
				{title}
			</Heading>
			<p>{body}</p>
		</div>

		<div className={style.actions}>{children}</div>
	</div>
);

export default PageMessage;
