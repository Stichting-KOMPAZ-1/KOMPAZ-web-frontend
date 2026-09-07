import { Field as BaseField } from "@base-ui/react/field";
import { useFieldContext } from "lib/forms";
import Field from "../field/field";
import Input, { type InputProps } from "./input";
import style from "./input.module.scss";

type Props = InputProps & {
	label?: string;
	description?: string;
	noError?: true; // Handy for multiple small fields in a row
};

const TSFInput = ({
	type = "text",
	label,
	description,
	required,
	noError,
	className,
	...props
}: Props) => {
	const field = useFieldContext<string>();

	return (
		<Field.Root>
			<Field.Label required={required}>{label}</Field.Label>
			<Input
				type={type}
				className={style.input}
				value={field.state.value}
				onChange={(evt) =>
					field.handleChange(evt.target.value)
				}
				onBlur={field.handleBlur}
				aria-invalid={!field.state.meta.isValid}
				{...props}
			/>
			{!noError && (
				<BaseField.Label className={style.errorLabel}>
					<Field.Error>
						{field.getMeta().errors}
					</Field.Error>
				</BaseField.Label>
			)}
			<Field.Description>{description}</Field.Description>
		</Field.Root>
	);
};

export default TSFInput;
