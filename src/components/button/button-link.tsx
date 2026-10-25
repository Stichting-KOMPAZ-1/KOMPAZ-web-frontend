import { Link, type LinkComponentProps } from "@tanstack/react-router";
import clsx from "clsx";

import type { ButtonSize, ButtonVariant } from "./button";

import style from "./button.module.scss";

type Props = LinkComponentProps & {
	size?: ButtonSize;
	variant?: ButtonVariant;
};

function ButtonLink({
	size = "medium",
	variant = "primary",
	className,
	...props
}: Props) {
	return (
		<Link
			className={clsx(
				style.button,
				style[`size-${size}`],
				style[`variant-${variant}`],
				className,
			)}
			{...props}
		/>
	);
}

export default ButtonLink;
