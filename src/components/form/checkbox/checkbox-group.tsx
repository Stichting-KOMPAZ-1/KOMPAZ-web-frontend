import { CheckboxGroup as BaseCheckboxGroup } from "@base-ui/react/checkbox-group";
import { Field as BaseField } from "@base-ui/react/field";
import { Fieldset } from "@base-ui/react/fieldset";
import clsx from "clsx";

import { FieldHint, FieldOptional } from "../field/field";
import { CheckboxOption, type CheckboxSize } from "./checkbox";

import style from "./checkbox.module.scss";

export type CheckboxGroupOption = {
	label: string;
	value: string;
};

export type CheckboxGroupProps = Omit<
	BaseCheckboxGroup.Props,
	"className" | "children"
> & {
	legend?: string;
	optional?: boolean;
	hint?: string;
	options: CheckboxGroupOption[];
	strikethrough?: boolean;
	size?: CheckboxSize;
	className?: string;
};

export function CheckboxGroup({
	legend,
	hint,
	optional = false,
	options,
	strikethrough,
	size = "medium",
	className,
	...props
}: CheckboxGroupProps) {
	return (
		<Fieldset.Root
			className={clsx(style.group, style[`size-${size}`], className)}
			render={<BaseCheckboxGroup {...props} />}
		>
			{legend && (
				<Fieldset.Legend className={style.legend}>
					{legend}
					{optional && <FieldOptional />}
				</Fieldset.Legend>
			)}
			{hint && <FieldHint>{hint}</FieldHint>}
			{options.map(({ value, label }) => (
				<BaseField.Item key={value}>
					<CheckboxOption
						value={value}
						label={label}
						strikethrough={strikethrough}
						size={size}
					/>
				</BaseField.Item>
			))}
		</Fieldset.Root>
	);
}

export default CheckboxGroup;
