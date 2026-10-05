import { Heading } from "components/heading/heading";
import type React from "react";

import style from "./resource-section.module.scss";

type Props = {
	title: string;
	children: React.ReactNode;
};

const ResourceSection = ({ title, children }: Props) => (
	<section className={style.section}>
		<Heading el="h2" size="20-24">
			{title}
		</Heading>
		<ul className={style.list}>{children}</ul>
	</section>
);

export default ResourceSection;
