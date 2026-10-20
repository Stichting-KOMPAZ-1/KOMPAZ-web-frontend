import Button from "components/button/button";
import Icon from "components/icon/icon";
import * as m from "lib/paraglide/messages";
import { useState } from "react";

import style from "./copy-link-button.module.scss";

type Props = {
	url?: string;
	label: string;
	copiedLabel: string;
};

type Status = "idle" | "copied" | "failed";

const RESET_DELAY_MS = 3000;

const CopyLinkButton = ({ url, label, copiedLabel }: Props) => {
	const [status, setStatus] = useState<Status>("idle");

	if (!url) return null;

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(url);
			setStatus("copied");
		} catch {
			setStatus("failed");
		}
		setTimeout(() => setStatus("idle"), RESET_DELAY_MS);
	};

	const icon =
		status === "copied"
			? "check"
			: status === "failed"
				? "triangle-alert"
				: "copy";

	return (
		<Button variant="secondary" onClick={copy}>
			<Icon name={icon} />
			<span className={style.label} aria-live="polite">
				{status === "copied"
					? copiedLabel
					: status === "failed"
						? m.module_copy_failed()
						: label}
			</span>
		</Button>
	);
};

export default CopyLinkButton;
