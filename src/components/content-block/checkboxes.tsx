import { CheckboxGroup, Field } from "components/form";
import RichText from "components/rich-text/rich-text";
import type { ContentBlockResource } from "lib/heyapi";

import style from "./checkboxes.module.scss";

type Props = {
	body: string | null;
	options: ContentBlockResource["checkboxes"];
};

const Checkboxes = ({ body, options }: Props) => (
	<div className={style.checkboxes}>
		<RichText html={body} />
		{options && options.length > 0 && (
			<Field>
				<CheckboxGroup
					options={options.map(({ id, label }) => ({ label, value: id }))}
					strikethrough
				/>
			</Field>
		)}
	</div>
);

export default Checkboxes;
