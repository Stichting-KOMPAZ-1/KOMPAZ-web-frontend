import { useFieldContext } from "lib/forms/form-context";
import { visibleError } from "lib/forms/validation-helpers";

import { Field, FieldError } from "../field/field";
import { RadioGroup } from "./radio-group";

type Props = Omit<
	React.ComponentProps<typeof RadioGroup>,
	"name" | "value" | "onValueChange" | "className" | "legend"
> & {
	/** Names the group. */
	label?: string;
	/** Class for the wrapping `<Field>` — the form's own layout class. */
	className?: string;
};

/** A single-choice question bound to the field it is rendered in. */
export function TSFRadioGroup({ label, className, ...props }: Props) {
	const field = useFieldContext<string>();
	const error = visibleError(field.state.meta);

	return (
		<Field
			className={className}
			invalid={error !== undefined}
			touched={field.state.meta.isTouched}
			dirty={field.state.meta.isDirty}
		>
			<RadioGroup
				{...props}
				legend={label}
				name={field.name}
				value={field.state.value}
				onValueChange={(value) => field.handleChange(value)}
				onBlur={field.handleBlur}
			/>
			<FieldError match={error !== undefined}>{error}</FieldError>
		</Field>
	);
}

export default TSFRadioGroup;
