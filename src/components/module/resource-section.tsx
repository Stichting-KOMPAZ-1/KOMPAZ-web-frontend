import { Heading } from "components/heading/heading";
import type React from "react";

import style from "./resource-section.module.scss";

type Props<T> = {
	title: string;
	items: readonly T[];
	children: (item: T) => React.ReactNode;
};

const ResourceSection = <T,>({ title, items, children }: Props<T>) =>
	items.length === 0 ? null : (
		<section className={style.section}>
			<Heading el="h2" size="20-24">
				{title}
			</Heading>
			<ul className={style.list}>{items.map((item) => children(item))}</ul>
		</section>
	);

export default ResourceSection;
