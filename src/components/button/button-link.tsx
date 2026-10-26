import { createLink } from "@tanstack/react-router";
import clsx from "clsx";
import { BaseAnchor } from "components/link/link";
import type React from "react";

import type { ButtonSize, ButtonVariant } from "./button";

import style from "./button.module.scss";

type StyleProps = {
	size?: ButtonSize;
	variant?: ButtonVariant;
};

const ButtonAnchor = ({
	size = "medium",
	variant = "primary",
	className,
	...props
}: React.ComponentPropsWithRef<"a"> & StyleProps) => (
	<BaseAnchor
		className={clsx(
			style.button,
			style[`size-${size}`],
			style[`variant-${variant}`],
			className,
		)}
		{...props}
	/>
);

const ButtonLink = createLink(ButtonAnchor);

export default ButtonLink;
