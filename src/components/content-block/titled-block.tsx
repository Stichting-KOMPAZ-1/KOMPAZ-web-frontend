import { Heading } from "components/heading/heading";
import type { ContentBlockResource } from "lib/heyapi";

import style from "./titled-block.module.scss";

type Props = {
	title: ContentBlockResource["title"];
	titleId?: string;
	children: React.ReactNode;
};

const TitledBlock = ({ title, titleId, children }: Props) => (
	<section className={style.block}>
		{title && (
			<Heading el="h2" size="20-24" id={titleId}>
				{title}
			</Heading>
		)}
		{children}
	</section>
);

export default TitledBlock;
