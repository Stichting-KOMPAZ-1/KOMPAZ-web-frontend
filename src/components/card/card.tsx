import clsx from "clsx";
import { Heading } from "components/heading/heading";
import type React from "react";

import style from "./card.module.scss";

export function Card({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) {
	return <div className={clsx(style.card, className)} {...props} />;
}

export function CardHeader({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) {
	return <div className={clsx(style.header, className)} {...props} />;
}

export function CardTitle({
	className,
	...props
}: Omit<React.ComponentProps<typeof Heading>, "size">) {
	return (
		<Heading size="large" className={clsx(style.title, className)} {...props} />
	);
}

export function CardDescription({
	className,
	...props
}: React.ComponentPropsWithoutRef<"p">) {
	return <p className={clsx(style.description, className)} {...props} />;
}
