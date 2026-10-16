import SystemMessage from "components/system-message/system-message";
import type React from "react";

import style from "./page-error.module.scss";

type Props = {
	children: React.ReactNode;
};

const PageError = ({ children }: Props) => (
	<div className={style.page}>
		<SystemMessage variant="error">{children}</SystemMessage>
	</div>
);

export default PageError;
