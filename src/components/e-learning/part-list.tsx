import { Collapsible } from "@base-ui/react/collapsible";
import Icon from "components/icon/icon";
import type { PartSummaryResource } from "lib/heyapi";
import * as m from "lib/paraglide/messages";

import PartRow from "./part-row";

import style from "./part-list.module.scss";

type Props = {
	parts: readonly PartSummaryResource[];
	eLearningId: string;
	chapterId: string;
	completedPartIds: ReadonlySet<string>;
	defaultOpen?: boolean;
	nextPartId?: string;
};

const PartList = ({
	parts,
	eLearningId,
	chapterId,
	completedPartIds,
	defaultOpen = false,
	nextPartId,
}: Props) =>
	parts.length === 0 ? null : (
		<Collapsible.Root className={style.root} defaultOpen={defaultOpen}>
			<Collapsible.Trigger className={style.trigger}>
				{m.elearning_part_count({ count: parts.length })}
				<Icon name="chevron-down" className={style.chevron} />
			</Collapsible.Trigger>

			<Collapsible.Panel className={style.panel}>
				<ul className={style.list}>
					{parts.map((part, index) => (
						<PartRow
							key={part.id}
							part={part}
							to={
								index === 0
									? `/e-learnings/${eLearningId}/chapters/${chapterId}`
									: `/e-learnings/${eLearningId}/parts/${part.id}`
							}
							done={completedPartIds.has(part.id)}
							callToAction={
								part.id === nextPartId ? m.elearning_start() : undefined
							}
						/>
					))}
				</ul>
			</Collapsible.Panel>
		</Collapsible.Root>
	);

export default PartList;
