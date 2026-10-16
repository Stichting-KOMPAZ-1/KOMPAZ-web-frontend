import clsx from "clsx";
import type React from "react";

import style from "./system-message.module.scss";

export type SystemMessageVariant = "success" | "error" | "warning";

type Props = React.ComponentPropsWithoutRef<"p"> & {
	variant: SystemMessageVariant;
};

function SystemMessage({ variant, className, ...props }: Props) {
	return (
		<p
			className={clsx(style.message, style[`variant-${variant}`], className)}
			{...props}
		/>
	);
}

export default SystemMessage;
