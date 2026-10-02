import { useFieldContext } from "lib/forms/form-context";
import { visibleError } from "lib/forms/validation-helpers";

import { Field, FieldError, FieldHint, FieldLabel } from "../field/field";
import { Textarea } from "./textarea";

type Props = Omit<
	React.ComponentProps<typeof Textarea>,
	"name" | "value" | "onValueChange" | "onBlur" | "className"
> & {
	label?: string;
	optional?: boolean;
	hint?: string;
	noError?: boolean;
	className?: string;
};

export function TSFTextarea({
	label,
	hint,
	optional = false,
	noError = false,
	className,
	...props
}: Props) {
	const field = useFieldContext<string>();
	const error = visibleError(field.state.meta);

	return (
		<Field
			className={className}
			invalid={error !== undefined}
			touched={field.state.meta.isTouched}
			dirty={field.state.meta.isDirty}
		>
			{label && <FieldLabel optional={optional}>{label}</FieldLabel>}
			{hint && <FieldHint>{hint}</FieldHint>}
			<Textarea
				{...props}
				name={field.name}
				value={field.state.value}
				aria-required={optional ? undefined : true}
				onValueChange={(value) => field.handleChange(value)}
				onBlur={field.handleBlur}
			/>
			<FieldError match={!noError && error !== undefined}>{error}</FieldError>
		</Field>
	);
}

export default TSFTextarea;
