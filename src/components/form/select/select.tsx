import style from "./select.module.scss";

export type SelectOption = {
	label: string;
	value: string;
};

type Props = React.ComponentPropsWithoutRef<"select"> & {
	name: string;
	options: SelectOption[];
	label?: string;
	isInvalid?: boolean;
};

function Select({
	label,
	options,
	isInvalid,
	...props
}: Props) {
	return (
		<select
			aria-invalid={isInvalid}
			className={style.select}
			{...props}
		>
			{options.map(({ value, label }) => (
				<option key={value} value={value}>
					{label}
				</option>
			))}
		</select>
	);
}

export default Select;
