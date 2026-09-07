import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import clsx from "clsx";
import CheckIcon from "./check.svg?react";
import style from "./checkbox.module.scss";

export type CheckboxProps = BaseCheckbox.Root.Props;

/**
 * This is just the Checkbox control wired into BaseUI
 * Use in combination with BaseField.Label
 */
const Checkbox = ({
	className,
	...props
}: CheckboxProps) => {
	return (
		<BaseCheckbox.Root
			className={clsx(style.control, className)}
			{...props}
		>
			<BaseCheckbox.Indicator className={style.indicator}>
				<CheckIcon />
			</BaseCheckbox.Indicator>
		</BaseCheckbox.Root>
	);
};

export default Checkbox;
