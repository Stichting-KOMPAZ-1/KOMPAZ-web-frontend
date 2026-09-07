import { CheckboxGroup as BaseCheckboxGroup } from "@base-ui/react/checkbox-group";
import { Field as BaseField } from "@base-ui/react/field";
import { useFieldContext } from "lib/forms";
import Field from "../field/field";
import Checkbox from "./checkbox";
import style from "./checkbox.module.scss";

export type CheckboxGroupItem = Readonly<{
	label: string;
	value: string;
}>;

type Props = {
	fieldLabel: string;
	items: CheckboxGroupItem[];
	required?: boolean;
	description?: string;
};

/**
 * A list of multiple checkboxes for tanstack form.
 * All checkboxes have the same name. The value will be an array of checked checkbox strings
 */
const TSFCheckboxGroup = ({
	fieldLabel,
	description,
	required,
	items,
}: Props) => {
	const field = useFieldContext<string[]>();

	return (
		<Field.Root>
			<Field.LabelLike required={required}>
				{fieldLabel}
			</Field.LabelLike>
			<BaseCheckboxGroup
				aria-labelledby={`${field.name}-label`}
				className={style.checkboxGroup}
				value={field.state.value}
				onValueChange={(value) => field.handleChange(value)}
			>
				{items.map(({ label, value }) => (
					<Field.Item
						key={value}
						render={(props) => (
							<BaseField.Label
								className={style.label}
								{...props}
							/>
						)}
					>
						<Checkbox
							id={`${field.name}-${value}`}
							value={value}
							onBlur={field.handleBlur}
							aria-invalid={!field.state.meta.isValid}
						/>

						{label}
					</Field.Item>
				))}
			</BaseCheckboxGroup>
			<Field.Error>{field.getMeta().errors}</Field.Error>
			<Field.Description>{description}</Field.Description>
		</Field.Root>
	);
};

export default TSFCheckboxGroup;
