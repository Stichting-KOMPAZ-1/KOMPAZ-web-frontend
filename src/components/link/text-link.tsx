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

type TextAnchorProps = React.ComponentPropsWithoutRef<"a"> &
	StyleProps & {
		newTab?: boolean;
	};

export const TextAnchor = ({
	inline = false,
	newTab = false,
	className,
	children,
	...props
}: TextAnchorProps) => (
	<a
		className={clsx(style.link, inline && style.inline, className)}
		{...(newTab && { target: "_blank", rel: "noopener noreferrer" })}
		{...props}
	>
		{children}
		{newTab && <span className="sr-only"> {m.link_new_tab()}</span>}
	</a>
);
