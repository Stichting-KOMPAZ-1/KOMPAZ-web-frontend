import { CheckboxGroup, Field } from "components/form";
import RichText from "components/rich-text/rich-text";
import { useStoredCheckboxes } from "hooks/use-stored-checkboxes";
import type { ContentBlockResource } from "lib/heyapi";
import { useId } from "react";

import TitledBlock from "./titled-block";

import style from "./checkboxes.module.scss";

type Props = {
	block: ContentBlockResource;
};

const Checkboxes = ({ block }: Props) => {
	const { checked, setChecked } = useStoredCheckboxes(block.id);
	const titleId = useId();

	return (
		<TitledBlock title={block.title} titleId={titleId}>
			<div className={style.checkboxes}>
				<RichText html={block.body} />
				{block.checkboxes && block.checkboxes.length > 0 && (
					<Field>
						<CheckboxGroup
							aria-labelledby={block.title ? titleId : undefined}
							options={block.checkboxes.map(({ id, label }) => ({
								label,
								value: id,
							}))}
							value={checked}
							onValueChange={setChecked}
							size="small"
							strikethrough
						/>
					</Field>
				)}
			</div>
		</TitledBlock>
	);
};

export default Checkboxes;
