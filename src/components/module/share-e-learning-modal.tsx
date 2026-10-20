import Button from "components/button/button";
import Icon from "components/icon/icon";
import Modal from "components/modal/modal";
import type { ELearningSummaryResource } from "lib/heyapi/types.gen";
import * as m from "lib/paraglide/messages";
import { usePermissions } from "lib/permissions";

import ShareELearningLinks from "./share-e-learning-links";
import ShareOrganizationForm from "./share-organization-form";

import style from "./share-e-learning-modal.module.scss";

type Props = {
	eLearning: ELearningSummaryResource;
	moduleId: string;
};

const ShareELearningModal = ({ eLearning, moduleId }: Props) => {
	const { name, shareUrl, qrCodeUrl } = eLearning;
	const { canShareForAnyOrganization } = usePermissions();

	if (!canShareForAnyOrganization && !shareUrl && !qrCodeUrl) return null;

	return (
		<Modal
			trigger={
				<Button variant="secondary" className={style.trigger}>
					<Icon name="share-2" />
					<span className={style.triggerLabel}>
						{m.module_share_elearning()}
					</span>
				</Button>
			}
			title={m.module_share_title()}
			description={
				canShareForAnyOrganization && m.module_share_organization_description()
			}
		>
			{canShareForAnyOrganization ? (
				<ShareOrganizationForm moduleId={moduleId} />
			) : (
				<ShareELearningLinks
					name={name}
					shareUrl={shareUrl}
					qrCodeUrl={qrCodeUrl}
				/>
			)}
		</Modal>
	);
};

export default ShareELearningModal;
