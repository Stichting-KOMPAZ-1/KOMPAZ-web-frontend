import Button from "components/button/button";
import { Field, FieldLabel, Textarea } from "components/form";
import Icon from "components/icon/icon";
import type { ELearningSummaryResource } from "lib/heyapi/types.gen";
import * as m from "lib/paraglide/messages";

import CopyLinkButton from "./copy-link-button";

import style from "./share-e-learning-links.module.scss";

type Props = Pick<ELearningSummaryResource, "name" | "shareUrl" | "qrCodeUrl">;

const downloadUrl = (url: string) => {
	const download = new URL(url, window.location.origin);
	download.searchParams.set("download", "");
	return download.toString();
};

const ShareELearningLinks = ({ name, shareUrl, qrCodeUrl }: Props) => {
	if (!shareUrl && !qrCodeUrl) return null;

	return (
		<div className={style.content}>
			{shareUrl && (
				<>
					<Field>
						<FieldLabel>{m.module_share_link_label()}</FieldLabel>
						<Textarea value={shareUrl} readOnly rows={2} />
					</Field>
					<CopyLinkButton
						url={shareUrl}
						label={m.module_share_copy_link()}
						copiedLabel={m.module_share_link_copied()}
					/>
				</>
			)}

			{qrCodeUrl && (
				<div className={style.qr}>
					<span className={style.qrLabel}>{m.module_share_qr_label()}</span>
					<img
						className={style.qrImage}
						src={qrCodeUrl}
						alt={m.module_share_qr_alt({ name })}
					/>
					<Button
						variant="secondary"
						nativeButton={false}
						render={
							<a href={downloadUrl(qrCodeUrl)} download>
								<Icon name="download" />
								{m.module_share_download_qr()}
							</a>
						}
					/>
				</div>
			)}
		</div>
	);
};

export default ShareELearningLinks;
