import { Field as BaseField } from "@base-ui/react/field";
import clsx from "clsx";
import Icon from "components/icon/icon";
import * as m from "lib/paraglide/messages";

import style from "./field.module.scss";

type Styled<TProps> = Omit<TProps, "className"> & {
	className?: string;
};

/**
 * Groups one control with its label, hint and error, and wires the `id`,
 * `aria-describedby` and `aria-invalid` between them.
 *
 * @example
 * <Field invalid={error !== undefined} touched={meta.isTouched}>
 * 	<FieldLabel>Email address</FieldLabel>
 * 	<Input name="email" type="email" />
 * 	<FieldError match={error !== undefined}>{error}</FieldError>
 * </Field>
 */
export function Field({ className, ...props }: Styled<BaseField.Root.Props>) {
	return <BaseField.Root {...props} className={clsx(style.root, className)} />;
}

/**
 * The visible "optional" label.
 */
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

/**
 * The control's error message. `match` decides visibility: always pass it
 * explicitly, because without it base-ui falls back to the native
 * `ValidityState` and renders browser-locale text that bypasses Paraglide.
 */
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
