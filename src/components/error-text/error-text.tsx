import clsx from "clsx";
import { Fragment, type HTMLAttributes } from "react";

import style from "./error-text.module.scss";

export type ErrorProp = string | string[];

type Props = Readonly<
	Omit<HTMLAttributes<HTMLElement>, "children"> & {
		className?: string;
		children?: ErrorProp;
	} & (
			| {
					el?: "p" | "span";
					htmlFor?: never;
			  }
			| {
					el: "label";
					htmlFor: string;
			  }
		)
>;

/**
 * Will only render if children is a string or array of strings.
 */
export function ErrorText({
	el = "p",
	className,
	children,
	htmlFor = undefined,
	...rest
}: Props) {
	if (!children || children.length < 1) return null;

	const El = el;
	return (
		<El
			{...rest}
			className={clsx(style.text, className)}
			htmlFor={htmlFor}
		>
			{Array.isArray(children)
				? children.map((e, i, all) => (
						// oxlint-disable-next-line react/no-array-index-key -- just text, no order logic
						<Fragment key={i}>
							{e}
							{i < all.length - 1 ? <br /> : null}
						</Fragment>
					))
				: children}
		</El>
	);
}
