import clsx from "clsx";
import type { JSX } from "react";

import style from "./heading.module.scss";

type TextProps = React.ComponentPropsWithoutRef<"h1"> & {
	el?: "p" | "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
	size: "14-16" | "16-18" | "20-24" | "24-32" | "32-40" | "40-56";
};

export const Heading = ({
	el = "p",
	size,
	className,
	children,
	...props
}: TextProps) => {
	const El: keyof JSX.IntrinsicElements = el;

	return (
		<El className={clsx(style[`size-${size}`], className)} {...props}>
			{children}
		</El>
	);
};

type HeadingProps = Omit<TextProps, "el">;

export const H1 = (props: HeadingProps) => <Heading el="h1" {...props} />;
export const H2 = (props: HeadingProps) => <Heading el="h2" {...props} />;
export const H3 = (props: HeadingProps) => <Heading el="h3" {...props} />;
export const H4 = (props: HeadingProps) => <Heading el="h4" {...props} />;
export const H5 = (props: HeadingProps) => <Heading el="h5" {...props} />;
export const H6 = (props: HeadingProps) => <Heading el="h6" {...props} />;
