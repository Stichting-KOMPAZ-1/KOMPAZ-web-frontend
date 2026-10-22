import { CheckboxGroup, Field } from "components/form";
import RichText from "components/rich-text/rich-text";

import style from "./checkboxes.module.scss";

type Props = {
	body: string | null;
	options: string[];
};

const Checkboxes = ({ body, options }: Props) => (
	<div className={style.checkboxes}>
		<RichText html={body} />
		{options.length > 0 && (
			<Field>
				<CheckboxGroup
					options={options.map((label, index) => ({
						label,
						value: String(index),
					}))}
				/>
			</Field>
		)}
	</div>
);

export default Checkboxes;
