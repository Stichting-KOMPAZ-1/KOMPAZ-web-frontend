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
 * The visible "required" star.
 *
 * `announce` is for groups whose role has no `aria-required` — a checkbox
 * group is a plain `role="group"` — so the word is spoken instead.
 */
export function FieldRequired({ announce = false }: { announce?: boolean }) {
	return (
		<>
			<span className={style.required} aria-hidden>
				&nbsp;*
			</span>
			{announce && <span className="sr-only">&nbsp;{m.forms_required()}</span>}
		</>
	);
}

export function FieldLabel({
	className,
	children,
	required = false,
	...props
}: Styled<BaseField.Label.Props> & { required?: boolean }) {
	return (
		<BaseField.Label {...props} className={clsx(style.label, className)}>
			{children}
			{required && <FieldRequired />}
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
