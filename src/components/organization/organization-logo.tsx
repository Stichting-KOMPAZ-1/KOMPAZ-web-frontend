import LogoMark from "assets/icons/logo-mark.svg?react";

import style from "./organization-logo.module.scss";

type Props = {
	src: string | null;
};

const OrganizationLogo = ({ src }: Props) => (
	<span className={style.slot}>
		{src ? (
			<img className={style.image} src={src} alt="" />
		) : (
			<LogoMark aria-hidden="true" className={style.mark} />
		)}
	</span>
);

export default OrganizationLogo;
