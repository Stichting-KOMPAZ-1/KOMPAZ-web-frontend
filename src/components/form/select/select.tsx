import { Field } from "@base-ui/react/field";
import clsx from "clsx";
import Icon from "components/icon/icon";
import * as m from "lib/paraglide/messages";

import style from "./select.module.scss";

export type SelectOption = {
	label: string;
	value: string;
};

export type SelectProps = Omit<Field.Control.Props, "className"> & {
	options: SelectOption[];
	className?: string;
};

/**
 * A dropdown inside a `<Field>`.
 *
 * @example
 * <Select name="status" options={[{ value: "open", label: "Open" }]} />
 */
export function Select({ options, className, ...props }: SelectProps) {
	// oxlint-disable-next-line jsx-a11y/control-has-associated-label -- base-ui's Field wires the label onto this control at runtime, which the rule cannot see
	const nativeSelect = <select />;

	return (
		<div className={clsx(style.control, className)}>
			<Field.Control {...props} className={style.select} render={nativeSelect}>
				{!options.some(({ value }) => value === "") && (
					<option value="">{m.forms_choose()}</option>
				)}
				{options.map(({ value, label }) => (
					<option key={value} value={value}>
						{label}
					</option>
				))}
			</Field.Control>
			<span className={style.chevron} aria-hidden>
				<Icon name="chevron-down" size={16} />
			</span>
		</div>
	);
}

export default Select;
