import { ErrorText } from "components/error-text/error-text";
import { useSubmitAttempts, useSubmitError } from "lib/forms";

import style from "./submit-error.module.scss";

type Props = {
	form: Parameters<typeof useSubmitError>[0] &
		Parameters<typeof useSubmitAttempts>[0];
};

/**
 * The live region is always mounted so screen readers announce
 * new error messages without focus moving.
 *
 * @example
 * <Button type="submit">{m.common_save()}</Button>
 * <SubmitError form={form} />
 */
export function SubmitError({ form }: Props) {
	const error = useSubmitError(form);
	const attempts = useSubmitAttempts(form);

	return (
		<div role="alert" className={style.root}>
			<ErrorText key={attempts} className={style.message}>
				{error}
			</ErrorText>
		</div>
	);
}

export default SubmitError;
