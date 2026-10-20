import { revalidateLogic } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { ErrorText } from "components/error-text/error-text";
import { Form, FormButton, SubmitError } from "components/form";
import LoadingIndicator from "components/loading-indicator/loading-indicator";
import { submitHandler, useAppForm, useIsSubmitting } from "lib/forms";
import { moduleActivationIndexOptions } from "lib/heyapi/@tanstack/react-query.gen";
import * as m from "lib/paraglide/messages";
import { z } from "zod";

import style from "./share-organization-form.module.scss";

type Props = {
	moduleId: string;
};

const schema = z.object({
	organizationId: z.string().min(1, m.module_share_organization_required()),
});

const ShareOrganizationForm = ({ moduleId }: Props) => {
	// TODO(KOM-94): replace it with a query that fetches only those organizations whose modules have the current e-learning
	const { data, isPending, isError } = useQuery(
		moduleActivationIndexOptions({ path: { module: moduleId } }),
	);

	const form = useAppForm({
		defaultValues: { organizationId: "" },
		validationLogic: revalidateLogic(),
		validators: { onDynamic: schema },
		// TODO(KOM-94): fetch the chosen organization's share links
		onSubmit: () => {},
	});

	const isSubmitting = useIsSubmitting(form);

	if (isPending) return <LoadingIndicator />;
	if (isError)
		return <ErrorText>{m.module_share_organizations_error()}</ErrorText>;
	if (data.items.length === 0) {
		return <p>{m.module_share_organizations_empty()}</p>;
	}

	const options = data.items.map((organization) => ({
		value: organization.organizationId,
		label: organization.organizationName,
	}));

	return (
		<Form
			label={m.module_share_organization_form()}
			className={style.content}
			onSubmit={submitHandler(form)}
		>
			<form.AppField name="organizationId">
				{(field) => (
					<field.Select
						label={m.module_share_organization_label()}
						options={options}
					/>
				)}
			</form.AppField>
			<FormButton
				isSubmitting={isSubmitting}
				loadingLabel={m.loading_message()}
			>
				{m.module_share_show_links()}
			</FormButton>
			<SubmitError form={form} hideWhenFieldsFail />
		</Form>
	);
};

export default ShareOrganizationForm;
