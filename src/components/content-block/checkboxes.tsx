import { CheckboxGroup, Field } from "components/form";
import RichText from "components/rich-text/rich-text";
import { useStoredCheckboxes } from "hooks/use-stored-checkboxes";
import type { ContentBlockResource } from "lib/heyapi";

import style from "./checkboxes.module.scss";

type Props = {
	block: ContentBlockResource;
};

const Checkboxes = ({ block }: Props) => {
	const { checked, setChecked } = useStoredCheckboxes(block.id);

	return (
		<div className={style.checkboxes}>
			<RichText html={block.body} />
			{block.checkboxes && block.checkboxes.length > 0 && (
				<Field>
					<CheckboxGroup
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
	);
};

export default Checkboxes;
