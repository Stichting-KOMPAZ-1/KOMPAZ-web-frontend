import { Field as BaseField } from "@base-ui/react/field";
import { useFieldContext } from "lib/forms";
import Field from "../field/field";
import Checkbox, { type CheckboxProps } from "./checkbox";
import style from "./checkbox.module.scss";

type Props = CheckboxProps & {
	label: string;
	fieldLabel?: string;
	description?: string;
};

/**
 * Single checkbox connector for tanstack form
 */
const TSFCheckbox = ({
	label,
	fieldLabel,
	description,
	required,
	className,
	...props
}: Props) => {
	const field = useFieldContext<boolean>();

	return (
		<Field.Root className={style.root}>
			<Field.LabelLike required={required}>
				{fieldLabel}
			</Field.LabelLike>
			<BaseField.Label className={style.label}>
				<Checkbox
					id={field.name}
					checked={field.state.value}
					onCheckedChange={(checked) =>
						field.handleChange(checked)
					}
					onBlur={field.handleBlur}
					aria-invalid={!field.state.meta.isValid}
					{...props}
				/>
				{label}
			</BaseField.Label>
			<Field.Error>{field.getMeta().errors}</Field.Error>
			<Field.Description>{description}</Field.Description>
		</Field.Root>
	);
};

export default TSFCheckbox;
