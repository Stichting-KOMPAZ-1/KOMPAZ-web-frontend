import { CheckboxGroup as BaseCheckboxGroup } from "@base-ui/react/checkbox-group";
import { Field as BaseField } from "@base-ui/react/field";
import { Fieldset } from "@base-ui/react/fieldset";
import clsx from "clsx";

import { FieldHint, FieldOptional } from "../field/field";
import { CheckboxOption } from "./checkbox";

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
	className?: string;
};

/**
 * Related checkboxes answering one question.
 *
 * @example
 * <CheckboxGroup
 * 	legend="Care programmes"
 * 	options={programmes}
 * 	value={selected}
 * 	onValueChange={setSelected}
 * />
 */
export function CheckboxGroup({
	legend,
	hint,
	optional = false,
	options,
	className,
	...props
}: CheckboxGroupProps) {
	return (
		<Fieldset.Root
			className={clsx(style.group, className)}
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
					<CheckboxOption value={value} label={label} />
				</BaseField.Item>
			))}
		</Fieldset.Root>
	);
}

export default CheckboxGroup;
