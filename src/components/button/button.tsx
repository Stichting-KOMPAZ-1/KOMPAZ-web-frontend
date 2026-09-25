import { Button as BaseUIButton } from "@base-ui/react/button";
import clsx from "clsx";
import type React from "react";

import style from "./button.module.scss";

export type ButtonSize = "medium" | "large";
export type ButtonVariant = "primary" | "secondary" | "link";

type Props = React.ComponentPropsWithoutRef<typeof BaseUIButton> & {
	size?: ButtonSize;
	variant?: ButtonVariant;
};

/**
 * Native button with Base UI enhancements for keyboard accessibility.
 *
 * @example
 * // Text button
 * <Button onClick={handleClick}>Click me</Button>
 *
 * @example
 * // Icon-only button — aria-label is REQUIRED
 * <Button aria-label="Close">
 *   <Icon name="x" aria-hidden="true" />
 * </Button>
 *
 */
function Button({
	size = "medium",
	variant = "primary",
	className,
	...props
}: Props) {
	return (
		<BaseUIButton
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

export default Button;
