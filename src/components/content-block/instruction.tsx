import { Heading } from "components/heading/heading";
import RichText from "components/rich-text/rich-text";
import type { ContentBlockResource } from "lib/heyapi";

import style from "./instruction.module.scss";

type Props = {
	block: ContentBlockResource;
};

const Instruction = ({ block }: Props) => (
	<section className={style.instruction}>
		{block.fileUrl && (
			<img className={style.image} src={block.fileUrl} alt="" />
		)}
		<div className={style.text}>
			{block.title && (
				<Heading el="h2" size="20-24" weight="semibold" className={style.title}>
					{block.number && (
						<span className={style.number}>{block.number}. </span>
					)}
					<span className={style.label}>{block.title}</span>
				</Heading>
			)}
			<RichText html={block.body} />
		</div>
	</section>
);

export default Instruction;
