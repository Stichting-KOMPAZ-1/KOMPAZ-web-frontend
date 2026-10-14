import ContactCard from "components/contact/contact-card";
import { Heading } from "components/heading/heading";
import type { ModuleContactResource } from "lib/heyapi";
import * as m from "lib/paraglide/messages";

import style from "./contact-section.module.scss";

type Props = {
	contacts: readonly ModuleContactResource[];
};

const ContactSection = ({ contacts }: Props) => {
	if (contacts.length === 0) return null;

	return (
		<section id="contact" className={style.section}>
			<div className={style.intro}>
				<Heading el="h2" size="20-24">
					{m.contact_title()}
				</Heading>
				<p className={style.subtitle}>{m.contact_subtitle()}</p>
			</div>

			<ul className={style.list}>
				{contacts.map((contact) => (
					<ContactCard key={contact.id} contact={contact} />
				))}
			</ul>
		</section>
	);
};

export default ContactSection;
