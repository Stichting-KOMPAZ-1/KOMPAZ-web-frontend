import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import clsx from "clsx";
import Icon, { type IconProps } from "components/icon/icon";

import style from "./checkbox.module.scss";

export type CheckboxSize = "medium" | "small";

const defaultIconSize: Record<CheckboxSize, IconProps["size"]> = {
	medium: 20,
	small: 16,
};

export type CheckboxProps = Omit<BaseCheckbox.Root.Props, "className"> & {
	size?: CheckboxSize;
	className?: string;
};

export function Checkbox({
	size = "medium",
	className,
	...props
}: CheckboxProps) {
	return (
		<BaseCheckbox.Root
			{...props}
			className={clsx(style.checkbox, style[`size-${size}`], className)}
		>
			<BaseCheckbox.Indicator className={style.indicator}>
				<Icon name="check" size={defaultIconSize[size]} />
			</BaseCheckbox.Indicator>
		</BaseCheckbox.Root>
	);
}

export function CheckboxOption({
	label,
	strikethrough = false,
	size = "medium",
	className,
	...props
}: CheckboxProps & { label: string; strikethrough?: boolean }) {
	return (
		<label
			className={clsx(
				style.option,
				style[`size-${size}`],
				strikethrough && style.strikethrough,
				className,
			)}
		>
			<Checkbox size={size} {...props} />
			<span className={style.label}>{label}</span>
		</label>
	);
}

export default Checkbox;
