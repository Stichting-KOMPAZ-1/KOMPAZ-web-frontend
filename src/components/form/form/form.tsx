import clsx from "clsx";
import style from "./form.module.scss";

type FormProps = React.ComponentProps<"form"> & {
	disabled?: boolean;
};

const Form = ({
	children,
	className,
	disabled = false,
	...props
}: FormProps) => {
	return (
		<form className={clsx([className])} {...props}>
			<fieldset
				disabled={disabled}
				className={style.disablerFieldset}
			>
				{children}
			</fieldset>
		</form>
	);
};

export default Form;
