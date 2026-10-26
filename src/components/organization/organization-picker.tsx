import { useQuery } from "@tanstack/react-query";
import { useMatches, useNavigate } from "@tanstack/react-router";
import { Field, FieldLabel, Select } from "components/form";
import {
	organizationsOptions,
	useSelectedOrganizationId,
} from "components/organization/organization-utils";
import * as m from "lib/paraglide/messages";
import { useSignedInUser } from "lib/session";

import style from "./organization-picker.module.scss";

type Props = {
	organizationName?: string | null;
};

const OrganizationPicker = ({ organizationName }: Props) => {
	const navigate = useNavigate();
	const user = useSignedInUser();
	const organizationId = useSelectedOrganizationId() ?? user.organizationId;
	const { data, isSuccess } = useQuery({
		enabled: organizationName === undefined,
		...organizationsOptions,
		select: (page) =>
			page.items.map(({ id, name }) => ({ value: id, label: name })),
	});

	const organizationFixed = useMatches({
		select: (matches) =>
			matches.some(({ staticData }) => staticData.organizationFixed),
	});
	const named = organizationName !== undefined;

	return (
		<Field className={style.picker} disabled={organizationFixed || !isSuccess}>
			<FieldLabel className={style.label}>
				{m.organization_picker_label()}
			</FieldLabel>
			<Select
				options={
					named ? [{ value: "", label: organizationName ?? "" }] : (data ?? [])
				}
				value={named ? "" : organizationId}
				onChange={({ target: { value } }) =>
					navigate({
						to: ".",
						search: (search) => ({
							...search,
							organizationId:
								value && value !== user.organizationId ? value : undefined,
						}),
					})
				}
			/>
		</Field>
	);
};

export default OrganizationPicker;
