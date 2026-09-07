import clsx from "clsx";
import type { JSX } from "react";
import style from "./heading.module.scss";

// All html heading, p and span elements have same attributes. Using h1 as template.
type TextProps = React.ComponentPropsWithoutRef<"h1"> & {
	el?:
		| "p"
		| "span"
		| "h1"
		| "h2"
		| "h3"
		| "h4"
		| "h5"
		| "h6";
	// Sizes should match the possible sizes from design and `font.scss` file.
	size: "small" | "medium" | "large";
};

/**
 * Headings and short texts that look like headings.
 * SIZE AND ELEMENT ARE INDEPENDENT OF EACH OTHER:
 * Make sure the element you choose is SEMANTICALLY CORRECT and the whole page has chronological headings!
 */
export const Heading = ({
	el = "p",
	size,
	className,
	children,
	...props
}: TextProps) => {
	const El: keyof JSX.IntrinsicElements = el;

	return (
		<El
			className={clsx(style[`size-${size}`], className)}
			{...props}
		>
			{children}
		</El>
	);
};

type HeadingProps = Omit<TextProps, "el">;

/**
 * Shortcuts so it looks more like html
 * Make sure the heading you use is SEMANTICALLY CORRECT for the location on the page!
 */
export const H1 = (props: HeadingProps) => (
	<Heading el="h1" {...props} />
);
export const H2 = (props: HeadingProps) => (
	<Heading el="h2" {...props} />
);
export const H3 = (props: HeadingProps) => (
	<Heading el="h3" {...props} />
);
export const H4 = (props: HeadingProps) => (
	<Heading el="h4" {...props} />
);
export const H5 = (props: HeadingProps) => (
	<Heading el="h5" {...props} />
);
export const H6 = (props: HeadingProps) => (
	<Heading el="h6" {...props} />
);
