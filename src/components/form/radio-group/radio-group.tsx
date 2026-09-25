import { Field as BaseField } from "@base-ui/react/field";
import { Fieldset } from "@base-ui/react/fieldset";
import { Radio as BaseRadio } from "@base-ui/react/radio";
import {
	RadioGroup as BaseRadioGroup,
	type RadioGroupProps as BaseRadioGroupProps,
} from "@base-ui/react/radio-group";
import clsx from "clsx";

import { FieldHint, FieldOptional } from "../field/field";

import style from "./radio-group.module.scss";

export type RadioGroupOption = {
	label: string;
	value: string;
};

type RadioProps = Omit<BaseRadio.Root.Props, "className"> & {
	className?: string;
};

/** One radio button. Only meaningful inside a `<RadioGroup>`. */
function Radio({ className, ...props }: RadioProps) {
	return (
		<BaseRadio.Root {...props} className={clsx(style.radio, className)}>
			<BaseRadio.Indicator className={style.indicator} />
		</BaseRadio.Root>
	);
}

export type RadioGroupProps = Omit<
	BaseRadioGroupProps<string>,
	"className" | "children"
> & {
	legend?: string;
	optional?: boolean;
	hint?: string;
	options: RadioGroupOption[];
	className?: string;
};

/**
 * A single-choice question.
 *
 * @example
 * <RadioGroup
 * 	legend="Preferred contact"
 * 	options={options}
 * 	value={value}
 * 	onValueChange={setValue}
 * />
 */
export function RadioGroup({
	legend,
	hint,
	optional = false,
	options,
	className,
	...props
}: RadioGroupProps) {
	return (
		<Fieldset.Root
			className={clsx(style.group, className)}
			render={
				<BaseRadioGroup
					{...props}
					aria-required={optional ? undefined : true}
				/>
			}
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
					<label className={style.option}>
						<Radio value={value} />
						<span>{label}</span>
					</label>
				</BaseField.Item>
			))}
		</Fieldset.Root>
	);
}

export default RadioGroup;
