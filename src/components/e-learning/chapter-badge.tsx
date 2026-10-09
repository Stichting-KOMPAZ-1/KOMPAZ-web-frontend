import clsx from "clsx";
import Icon from "components/icon/icon";

import style from "./chapter-badge.module.scss";

type Props = {
	number?: number;
	size?: "default" | "large";
};

const ChapterBadge = ({ number, size = "default" }: Props) => (
	<span className={clsx(style.badge, style[`size-${size}`])} aria-hidden="true">
		{number ?? <Icon name="graduation-cap" size={24} />}
	</span>
);

export default ChapterBadge;
