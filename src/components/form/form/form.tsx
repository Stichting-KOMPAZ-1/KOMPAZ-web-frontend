import { Fieldset } from "@base-ui/react/fieldset";
import clsx from "clsx";

import style from "./form.module.scss";

type FormProps = React.ComponentProps<"form"> & {
	disabled?: boolean;
	label?: string;
};

/**
 * A form with its own validation and an optional disabled state.
 *
 * @example
 * <Form onSubmit={submitHandler(form)}>
 */
const Form = ({
	children,
	className,
	disabled = false,
	label,
	...props
}: FormProps) => {
	return (
		<form noValidate className={clsx(style.form, className)} {...props}>
			<Fieldset.Root disabled={disabled} className={style.disablerFieldset}>
				{label && (
					<Fieldset.Legend className="sr-only">{label}</Fieldset.Legend>
				)}
				{children}
			</Fieldset.Root>
		</form>
	);
};

export default Form;
