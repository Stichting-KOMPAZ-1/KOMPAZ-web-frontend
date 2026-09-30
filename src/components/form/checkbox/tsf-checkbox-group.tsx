import { useFieldContext } from "lib/forms/form-context";
import { visibleError } from "lib/forms/validation-helpers";

import { Field, FieldError } from "../field/field";
import { CheckboxGroup } from "./checkbox-group";

type Props = Omit<
	React.ComponentProps<typeof CheckboxGroup>,
	"value" | "onValueChange" | "className" | "legend"
> & {
	label?: string;
	className?: string;
};

/**
 * A set of related checkboxes bound to one array field.
 */
export function TSFCheckboxGroup({ label, className, ...props }: Props) {
	const field = useFieldContext<string[]>();
	const error = visibleError(field.state.meta);

	return (
		<Field
			className={className}
			invalid={error !== undefined}
			touched={field.state.meta.isTouched}
			dirty={field.state.meta.isDirty}
		>
			<CheckboxGroup
				{...props}
				legend={label}
				value={field.state.value}
				onValueChange={(value) => field.handleChange(value)}
				onBlur={field.handleBlur}
			/>
			<FieldError match={error !== undefined}>{error}</FieldError>
		</Field>
	);
}

export default TSFCheckboxGroup;
