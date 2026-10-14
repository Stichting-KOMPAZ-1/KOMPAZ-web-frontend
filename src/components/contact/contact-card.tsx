import { Heading } from "components/heading/heading";
import Icon from "components/icon/icon";
import { Anchor } from "components/link/link";
import type { ModuleContactResource } from "lib/heyapi";

import style from "./contact-card.module.scss";

type Props = {
	contact: ModuleContactResource;
};

const ContactCard = ({ contact }: Props) => (
	<li className={style.card}>
		<div className={style.identity}>
			{contact.jobRole && <p className={style.role}>{contact.jobRole}</p>}

			<Heading el="h3" size="18-20">
				{contact.name}
			</Heading>

			{contact.reason && <p>{contact.reason}</p>}
		</div>

		{(contact.email || contact.phone) && (
			<div className={style.details}>
				{contact.email && (
					<p className={style.detail}>
						<span className={style.iconBlock}>
							<Icon name="mail" size={24} />
						</span>
						<Anchor className={style.link} href={`mailto:${contact.email}`}>
							{contact.email}
						</Anchor>
					</p>
				)}

				{contact.phone && (
					<p className={style.detail}>
						<span className={style.iconBlock}>
							<Icon name="phone" size={24} />
						</span>
						<span className={style.stacked}>
							<Anchor className={style.link} href={`tel:${contact.phone}`}>
								{contact.phone}
							</Anchor>
							{contact.availability && (
								<span className={style.availability}>
									{contact.availability}
								</span>
							)}
						</span>
					</p>
				)}
			</div>
		)}
	</li>
);

export default ContactCard;
