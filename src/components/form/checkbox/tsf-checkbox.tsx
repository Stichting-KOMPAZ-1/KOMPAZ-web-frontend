import { useFieldContext } from "lib/forms/form-context";
import { visibleError } from "lib/forms/validation-helpers";

import { Field, FieldError, FieldHint } from "../field/field";
import { CheckboxOption } from "./checkbox";

type Props = Omit<
	React.ComponentProps<typeof CheckboxOption>,
	"name" | "checked" | "onCheckedChange" | "className"
> & {
	hint?: string;
	/** Class for the wrapping `<Field>` — the form's own layout class. */
	className?: string;
};

/**
 * One standalone checkbox bound to the field it is rendered in. A set of
 * related checkboxes is a different control: `TSFCheckboxGroup`.
 */
export function TSFCheckbox({ hint, className, ...props }: Props) {
	const field = useFieldContext<boolean>();
	const error = visibleError(field.state.meta);

	return (
		<Field
			className={className}
			invalid={error !== undefined}
			touched={field.state.meta.isTouched}
			dirty={field.state.meta.isDirty}
		>
			{hint && <FieldHint>{hint}</FieldHint>}
			<CheckboxOption
				{...props}
				name={field.name}
				checked={field.state.value}
				onCheckedChange={(checked) => field.handleChange(checked)}
				onBlur={field.handleBlur}
			/>
			<FieldError match={error !== undefined}>{error}</FieldError>
		</Field>
	);
}

export default TSFCheckbox;
