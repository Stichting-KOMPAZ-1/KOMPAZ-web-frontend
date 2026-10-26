import { Dialog } from "@base-ui/react/dialog";
import Button from "components/button/button";
import ConsentBanner from "components/consent-banner/consent-banner";
import { isAnalyticsEnabled, readConsent } from "lib/analytics";
import * as m from "lib/paraglide/messages";
import { useState } from "react";

import style from "./footer.module.scss";

function Footer() {
	const [consentOpen, setConsentOpen] = useState(
		() => isAnalyticsEnabled() && readConsent() === null,
	);

	return (
		<footer className={style.footer}>
			<div className={style.bar}>
				<Dialog.Root
					open={consentOpen}
					onOpenChange={setConsentOpen}
					modal={false}
				>
					<Dialog.Trigger render={<Button variant="link-inverse" />}>
						{m.consent_settings()}
					</Dialog.Trigger>
					<ConsentBanner onAnswer={() => setConsentOpen(false)} />
				</Dialog.Root>
			</div>
		</footer>
	);
}

export default Footer;
