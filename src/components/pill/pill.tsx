import clsx from "clsx";
import type React from "react";

import style from "./pill.module.scss";

export type PillVariant = "accent" | "accent-strong" | "error" | "success";

type Props = React.ComponentPropsWithoutRef<"span"> & {
	variant?: PillVariant;
};

const Pill = ({ variant = "accent", className, ...props }: Props) => (
	<span
		className={clsx(style.pill, style[`variant-${variant}`], className)}
		{...props}
	/>
);

export default Pill;
