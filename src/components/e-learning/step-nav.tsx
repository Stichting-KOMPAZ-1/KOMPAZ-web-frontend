import Button from "components/button/button";
import ButtonLink from "components/button/button-link";
import type { ELearningNavigationLink } from "components/e-learning/e-learning-navigation";
import Icon from "components/icon/icon";
import * as m from "lib/paraglide/messages";

import style from "./step-nav.module.scss";

type Props = {
	previousTo?: ELearningNavigationLink;
	nextTo?: ELearningNavigationLink;
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
			<ButtonLink {...previousTo} variant="secondary">
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
			<ButtonLink {...nextTo} className={style.next}>
				{nextLabel}
				{!hideNextIcon && <Icon name="arrow-right" />}
			</ButtonLink>
		)}
	</nav>
);

export default StepNav;
