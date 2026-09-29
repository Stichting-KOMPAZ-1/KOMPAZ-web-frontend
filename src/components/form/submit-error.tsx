import clsx from "clsx";
import { ErrorText } from "components/error-text/error-text";
import {
	useHasFieldErrors,
	useSubmitAttempts,
	useSubmitError,
} from "lib/forms";

import style from "./submit-error.module.scss";

type Props = {
	form: Parameters<typeof useSubmitError>[0] &
		Parameters<typeof useSubmitAttempts>[0] &
		Parameters<typeof useHasFieldErrors>[0];
	/**
	 * Takes the message off the screen while a field is showing one of its own,
	 * for a form short enough that the field error is already in view.
	 */
	hideWhenFieldsFail?: boolean;
};

/**
 * The live region is always mounted so screen readers announce
 * new error messages without focus moving.
 *
 * @example
 * <FormButton isSubmitting={isSubmitting}>{m.common_save()}</FormButton>
 * <SubmitError form={form} />
 *
 * @example
 * // A one-field form, where the banner would only repeat the field
 * <SubmitError form={form} hideWhenFieldsFail />
 */
export function SubmitError({ form, hideWhenFieldsFail = false }: Props) {
	const error = useSubmitError(form);
	const attempts = useSubmitAttempts(form);
	const fieldsFailed = useHasFieldErrors(form);

	return (
		<div
			role="alert"
			className={clsx(
				style.root,
				hideWhenFieldsFail && fieldsFailed && "sr-only",
			)}
		>
			<ErrorText key={attempts} className={style.message}>
				{error}
			</ErrorText>
		</div>
	);
}

export default SubmitError;
