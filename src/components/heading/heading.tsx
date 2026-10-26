import clsx from "clsx";
import type { JSX } from "react";

import style from "./heading.module.scss";

type TextProps = React.ComponentPropsWithoutRef<"h1"> & {
	el?: "p" | "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
	size: Size;
	weight?: Weight;
};

type Size = "16-18" | "18-20" | "20-24" | "24-32";
type Weight = "semibold" | "bold";

const defaultWeight: Record<Size, Weight> = {
	"16-18": "semibold",
	"18-20": "semibold",
	"20-24": "bold",
	"24-32": "bold",
};

export const Heading = ({
	el = "p",
	size,
	weight = defaultWeight[size],
	className,
	children,
	...props
}: TextProps) => {
	const El: keyof JSX.IntrinsicElements = el;

	return (
		<El className={clsx(style[`${weight}-${size}`], className)} {...props}>
			{children}
		</El>
	);
};
