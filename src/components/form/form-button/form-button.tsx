import Button from "components/button/button";
import { useId } from "react";
import type React from "react";

import style from "./form-button.module.scss";

type Props = Omit<
	React.ComponentPropsWithoutRef<typeof Button>,
	"disabled" | "focusableWhenDisabled" | "aria-labelledby" | "type"
> & {
	isSubmitting: boolean;
	loadingLabel?: React.ReactNode;
	renderLabel?: (isSubmitting: boolean) => React.ReactNode;
};

/**
 * A submit button that announces the form's submitting state.
 *
 * @example
 * <FormButton isSubmitting={isSubmitting}>Submit</FormButton>
 */
function FormButton({
	isSubmitting,
	loadingLabel = "Saving...",
	renderLabel,
	children,
	...props
}: Props) {
	const labelId = useId();
	const statusId = useId();

	const displayLabel = renderLabel
		? renderLabel(isSubmitting)
		: isSubmitting
			? loadingLabel
			: children;

	return (
		<>
			<output
				id={statusId}
				aria-live="polite"
				aria-atomic="true"
				className="sr-only"
			>
				{isSubmitting && "Form is being submitted"}
			</output>

			<Button
				type="submit"
				disabled={isSubmitting}
				focusableWhenDisabled
				aria-labelledby={labelId}
				{...props}
			>
				<span id={labelId} className={style.label}>
					{displayLabel}
				</span>
			</Button>
		</>
	);
}

export default FormButton;
