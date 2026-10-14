import { createLink } from "@tanstack/react-router";
import clsx from "clsx";
import * as m from "lib/paraglide/messages";
import type React from "react";

import style from "./text-link.module.scss";

type StyleProps = {
	inline?: boolean;
};

const TextLinkAnchor = ({
	inline = false,
	className,
	children,
	...props
}: React.ComponentPropsWithRef<"a"> & StyleProps) => (
	<a className={clsx(style.link, inline && style.inline, className)} {...props}>
		{children}
	</a>
);

export const TextLink = createLink(TextLinkAnchor);

type TextAnchorProps = React.ComponentPropsWithoutRef<"a"> & StyleProps;

export const TextAnchor = ({
	inline = false,
	className,
	children,
	target,
	rel = target === "_blank" ? "noopener noreferrer" : undefined,
	...props
}: TextAnchorProps) => (
	<a
		className={clsx(style.link, inline && style.inline, className)}
		target={target}
		rel={rel}
		{...props}
	>
		{children}
		{target === "_blank" && (
			<span className="sr-only"> {m.link_new_tab()}</span>
		)}
	</a>
);
