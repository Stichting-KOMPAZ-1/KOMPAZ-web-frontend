import { Fieldset } from "@base-ui/react/fieldset";
import clsx from "clsx";

import style from "./form.module.scss";

type FormProps = React.ComponentProps<"form"> & {
	disabled?: boolean;
	/** Names the disabler fieldset, so it isn't an unnamed group in the a11y tree. */
	label?: string;
};

/**
 * `noValidate` is deliberate: without it the browser intercepts submit and
 * shows its own tooltip in its own locale, bypassing both the form's
 * validators and Paraglide.
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
