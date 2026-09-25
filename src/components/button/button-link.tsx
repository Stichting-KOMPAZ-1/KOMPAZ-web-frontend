import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import type React from "react";

import type { ButtonSize, ButtonVariant } from "./button";

import style from "./button.module.scss";

type Props = React.ComponentPropsWithoutRef<typeof Link> & {
	size?: ButtonSize;
	variant?: ButtonVariant;
};

/**
 * Navigation link styled as a button.
 *
 * @example
 * // Wizard step navigation
 * <ButtonLink to="/next-step" size="large">Continue</ButtonLink>
 *
 * @example
 * // Toolbar button that navigates
 * <ButtonLink to="/settings" aria-label="Settings">
 *   <Icon name="gear" aria-hidden="true" />
 * </ButtonLink>
 */
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
