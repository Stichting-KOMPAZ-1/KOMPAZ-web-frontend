import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import { Heading } from "components/heading/heading";
import Pill from "components/pill/pill";
import type { ModuleSummaryResource } from "lib/heyapi";
import * as m from "lib/paraglide/messages";

import style from "./module-card.module.scss";

type Props = {
	module: ModuleSummaryResource;
};

const ModuleCard = ({ module }: Props) => {
	const inDevelopment = module.status === "InDevelopment";

	return (
		<li className={style.item}>
			<Link
				to="/modules/$moduleId"
				params={{ moduleId: module.id }}
				className={style.card}
			>
				<div
					className={clsx(style.media, inDevelopment && style.inDevelopment)}
				>
					{module.imageUrl && (
						<img className={style.image} src={module.imageUrl} alt="" />
					)}
					<div className={style.pills}>
						<Pill variant="accent-strong" className={style.pill}>
							{module.category}
						</Pill>
						{inDevelopment && (
							<Pill className={style.pill}>{m.library_in_development()}</Pill>
						)}
					</div>
				</div>

				<div className={style.body}>
					<Heading el="h3" size="18-20">
						{module.name}
					</Heading>
					<p className={style.description}>{module.description}</p>
				</div>
			</Link>
		</li>
	);
};

export default ModuleCard;
