import clsx from "clsx";
import Icon from "components/icon/icon";

import style from "./part-status.module.scss";

type Props = {
	done: boolean;
};

const PartStatus = ({ done }: Props) => (
	<span className={clsx(style.status, done && style.done)} aria-hidden="true">
		{done && <Icon name="check" size={16} />}
	</span>
);

export default PartStatus;
