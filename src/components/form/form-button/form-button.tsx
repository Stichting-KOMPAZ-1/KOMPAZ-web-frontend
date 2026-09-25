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
 * Automatically manages focus, accessible name, and state announcements.
 *
 * @example
 * // Basic submission with loading state
 * <FormButton isSubmitting={isSubmitting}>Submit</FormButton>
 *
 * @example
 * // Custom loading message
 * <FormButton isSubmitting={isSubmitting} loadingLabel="Uploading...">Upload</FormButton>
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
