import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import clsx from "clsx";
import Icon from "components/icon/icon";

import style from "./checkbox.module.scss";

export type CheckboxProps = Omit<BaseCheckbox.Root.Props, "className"> & {
	className?: string;
};

/**
 * The box on its own. Use `CheckboxOption`
 * unless the label is already supplied by a surrounding `<Field>`.
 */
export function Checkbox({ className, ...props }: CheckboxProps) {
	return (
		<BaseCheckbox.Root {...props} className={clsx(style.checkbox, className)}>
			<BaseCheckbox.Indicator className={style.indicator}>
				<Icon name="check" size={20} />
			</BaseCheckbox.Indicator>
		</BaseCheckbox.Root>
	);
}

/**
 * A checkbox and its text as one clickable row.
 *
 * @example
 * <CheckboxOption
 * 	label="Open for registration"
 * 	checked={value}
 * 	onCheckedChange={setValue}
 * />
 */
export function CheckboxOption({
	label,
	className,
	...props
}: CheckboxProps & { label: string }) {
	return (
		<label className={clsx(style.option, className)}>
			<Checkbox {...props} />
			<span>{label}</span>
		</label>
	);
}

export default Checkbox;
