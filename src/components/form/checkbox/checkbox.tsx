import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import clsx from "clsx";
import Icon from "components/icon/icon";

import style from "./checkbox.module.scss";

export type CheckboxProps = Omit<BaseCheckbox.Root.Props, "className"> & {
	className?: string;
};

export function Checkbox({ className, ...props }: CheckboxProps) {
	return (
		<BaseCheckbox.Root {...props} className={clsx(style.checkbox, className)}>
			<BaseCheckbox.Indicator className={style.indicator}>
				<Icon name="check" size={20} />
			</BaseCheckbox.Indicator>
		</BaseCheckbox.Root>
	);
}

export function CheckboxOption({
	label,
	strikethrough = false,
	className,
	...props
}: CheckboxProps & { label: string; strikethrough?: boolean }) {
	return (
		<label
			className={clsx(
				style.option,
				strikethrough && style.strikethrough,
				className,
			)}
		>
			<Checkbox {...props} />
			<span className={style.label}>{label}</span>
		</label>
	);
}

export default Checkbox;
