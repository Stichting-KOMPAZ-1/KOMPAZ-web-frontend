import { Dialog } from "@base-ui/react/dialog";
import Button from "components/button/button";
import { type ConsentChoice, saveConsent } from "lib/analytics";
import * as m from "lib/paraglide/messages";

import style from "./consent-banner.module.scss";

type Props = {
	onAnswer: () => void;
};

function ConsentBanner({ onAnswer }: Props) {
	const answer = (choice: ConsentChoice) => {
		saveConsent(choice);
		onAnswer();
	};

	return (
		<Dialog.Portal>
			<Dialog.Popup className={style.banner} aria-label={m.consent_label()}>
				<p className={style.message}>{m.consent_message()}</p>
				<p className={style.message}>{m.consent_change_later()}</p>
				<div className={style.actions}>
					<Button variant="secondary" onClick={() => answer("denied")}>
						{m.consent_decline()}
					</Button>
					<Button onClick={() => answer("granted")}>
						{m.consent_accept()}
					</Button>
				</div>
			</Dialog.Popup>
		</Dialog.Portal>
	);
}

export default ConsentBanner;
