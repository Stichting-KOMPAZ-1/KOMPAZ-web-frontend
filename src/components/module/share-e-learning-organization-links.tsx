import { useQuery } from "@tanstack/react-query";
import { ErrorText } from "components/error-text/error-text";
import { Field, FieldLabel, Select } from "components/form";
import LoadingIndicator from "components/loading-indicator/loading-indicator";
import { eLearningShareIndexOptions } from "lib/heyapi/@tanstack/react-query.gen";
import type { ELearningSummaryResource } from "lib/heyapi/types.gen";
import * as m from "lib/paraglide/messages";
import { useState } from "react";

import ShareELearningLinks from "./share-e-learning-links";

import style from "./share-e-learning-organization-links.module.scss";

type Props = Pick<ELearningSummaryResource, "id" | "name">;

const ShareELearningOrganizationLinks = ({ id, name }: Props) => {
	const [shareId, setShareId] = useState("");
	const { data, isPending, isError } = useQuery(
		eLearningShareIndexOptions({ path: { eLearning: id } }),
	);

	if (isPending) return <LoadingIndicator />;
	if (isError)
		return <ErrorText>{m.module_share_organizations_error()}</ErrorText>;
	if (data.items.length === 0) {
		return <p>{m.module_share_organizations_empty()}</p>;
	}

	const share = data.items.find((item) => item.qrCodeUrl === shareId);

	const options = data.items.map((item) => ({
		value: item.qrCodeUrl,
		label: `${item.organizationName} — ${item.moduleName}`,
	}));

	return (
		<div className={style.content}>
			<Field>
				<FieldLabel>{m.module_share_organization_label()}</FieldLabel>
				<Select
					options={options}
					value={shareId}
					onChange={(event) => setShareId(event.target.value)}
				/>
			</Field>
			{share && (
				<ShareELearningLinks
					name={name}
					shareUrl={share.shareUrl}
					qrCodeUrl={share.qrCodeUrl}
				/>
			)}
		</div>
	);
};

export default ShareELearningOrganizationLinks;
