import { createLink } from "@tanstack/react-router";
import clsx from "clsx";
import * as m from "lib/paraglide/messages";
import type React from "react";

import style from "./link.module.scss";

type StyleProps = {
	inline?: boolean;
};

export const BaseAnchor = ({
	children,
	target,
	rel = target === "_blank" ? "noopener noreferrer" : undefined,
	...props
}: React.ComponentPropsWithRef<"a">) => (
	<a target={target} rel={rel} {...props}>
		{children}
		{target === "_blank" && (
			<span className="sr-only"> {m.link_new_tab()}</span>
		)}
	</a>
);

export const LinkAnchor = ({
	inline = false,
	className,
	...props
}: React.ComponentPropsWithRef<"a"> & StyleProps) => (
	<BaseAnchor
		className={clsx(style.link, inline && style.inline, className)}
		{...props}
	/>
);

export const Link = createLink(LinkAnchor);
