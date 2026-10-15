import Button from "components/button/button";
import {
	type ConsentChoice,
	isAnalyticsEnabled,
	readConsent,
	saveConsent,
} from "lib/analytics";
import * as m from "lib/paraglide/messages";
import { useState } from "react";

import style from "./consent-banner.module.scss";

function ConsentBanner() {
	const [open, setOpen] = useState(() => readConsent() === null);

	if (!isAnalyticsEnabled()) {
		return null;
	}

	// Withdrawing consent has to be as easy as giving it, so once answered the
	// choice stays one click away on every page.
	if (!open) {
		return (
			<Button
				variant="link"
				className={style.settings}
				onClick={() => setOpen(true)}
			>
				{m.consent_settings()}
			</Button>
		);
	}

	const answer = (choice: ConsentChoice) => {
		saveConsent(choice);
		setOpen(false);
	};

	return (
		<section className={style.banner} aria-label={m.consent_label()}>
			<p className={style.message}>{m.consent_message()}</p>
			<p className={style.message}>{m.consent_change_later()}</p>
			<div className={style.actions}>
				<Button variant="secondary" onClick={() => answer("denied")}>
					{m.consent_decline()}
				</Button>
				<Button onClick={() => answer("granted")}>{m.consent_accept()}</Button>
			</div>
		</section>
	);
}

export default ConsentBanner;
