import Button from "components/button/button";
import ButtonLink from "components/button/button-link";
import Icon from "components/icon/icon";
import * as m from "lib/paraglide/messages";

import style from "./step-nav.module.scss";

type Props = {
	previousTo?: string;
	nextTo?: string;
	nextLabel: string;
	hideNextIcon?: boolean;
};

const StepNav = ({
	previousTo,
	nextTo,
	nextLabel,
	hideNextIcon = false,
}: Props) => (
	<nav className={style.nav}>
		{previousTo ? (
			<ButtonLink variant="secondary" to={previousTo}>
				<Icon name="arrow-left" />
				{m.elearning_chapter_previous()}
			</ButtonLink>
		) : (
			<Button variant="secondary" disabled>
				<Icon name="arrow-left" />
				{m.elearning_chapter_previous()}
			</Button>
		)}

		{nextTo && (
			<ButtonLink className={style.next} to={nextTo}>
				{nextLabel}
				{!hideNextIcon && <Icon name="arrow-right" />}
			</ButtonLink>
		)}
	</nav>
);

export default StepNav;
