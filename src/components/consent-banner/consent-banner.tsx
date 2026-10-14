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
	const [answered, setAnswered] = useState(() => readConsent() !== null);

	if (!isAnalyticsEnabled() || answered) {
		return null;
	}

	const answer = (choice: ConsentChoice) => {
		saveConsent(choice);
		setAnswered(true);
	};

	return (
		<section className={style.banner} aria-label={m.consent_label()}>
			<p className={style.message}>{m.consent_message()}</p>
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
