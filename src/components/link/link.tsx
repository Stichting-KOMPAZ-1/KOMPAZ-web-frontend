import { createLink } from "@tanstack/react-router";
import clsx from "clsx";
import * as m from "lib/paraglide/messages";
import type React from "react";

import style from "./link.module.scss";

type StyleProps = {
	inline?: boolean;
};

export const LinkAnchor = ({
	inline = false,
	className,
	children,
	target,
	rel = target === "_blank" ? "noopener noreferrer" : undefined,
	...props
}: React.ComponentPropsWithRef<"a"> & StyleProps) => (
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

export const Link = createLink(LinkAnchor);
