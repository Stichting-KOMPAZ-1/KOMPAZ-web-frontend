import { Field as BaseField } from "@base-ui/react/field";
import clsx from "clsx";
import Icon from "components/icon/icon";
import * as m from "lib/paraglide/messages";

import style from "./field.module.scss";

type Styled<TProps> = Omit<TProps, "className"> & {
	className?: string;
};

export function Field({ className, ...props }: Styled<BaseField.Root.Props>) {
	return <BaseField.Root {...props} className={clsx(style.root, className)} />;
}

export function FieldOptional() {
	return <span className={style.optional}>&nbsp;({m.forms_optional()})</span>;
}

export function FieldLabel({
	className,
	children,
	optional = false,
	...props
}: Styled<BaseField.Label.Props> & { optional?: boolean }) {
	return (
		<BaseField.Label {...props} className={clsx(style.label, className)}>
			{children}
			{optional && <FieldOptional />}
		</BaseField.Label>
	);
}

export function FieldHint({
	className,
	...props
}: Styled<BaseField.Description.Props>) {
	return (
		<BaseField.Description {...props} className={clsx(style.hint, className)} />
	);
}

export function FieldError({
	className,
	children,
	...props
}: Styled<BaseField.Error.Props> &
	Required<Pick<BaseField.Error.Props, "match">>) {
	return (
		<BaseField.Error {...props} className={clsx(style.error, className)}>
			<Icon name="triangle-alert" size={14} />
			<span>{children}</span>
		</BaseField.Error>
	);
}
