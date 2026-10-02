import { Fieldset } from "@base-ui/react/fieldset";
import clsx from "clsx";

import style from "./form.module.scss";

type FormProps = React.ComponentProps<"form"> & {
	disabled?: boolean;
	label?: string;
};

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
