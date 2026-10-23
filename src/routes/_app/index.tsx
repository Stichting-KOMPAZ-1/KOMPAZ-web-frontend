import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Heading } from "components/heading/heading";
import ModuleCard from "components/module/module-card";
import PageError from "components/page/page-error";
import PageLoading from "components/page/page-loading";
import { moduleIndexOptions } from "lib/heyapi/@tanstack/react-query.gen";
import * as m from "lib/paraglide/messages";
import { makePageTitle } from "lib/title";

import style from "./index.module.scss";

const modulesQuery = moduleIndexOptions({ query: { pageSize: 100 } });

export const Route = createFileRoute("/_app/")({
	loader: ({ context }) => context.queryClient.ensureQueryData(modulesQuery),
	head: () => ({
		meta: [{ title: makePageTitle(m.library_title()) }],
	}),
	errorComponent: () => <PageError>{m.library_load_error()}</PageError>,
	pendingComponent: PageLoading,
	component: LibraryPage,
});

function LibraryPage() {
	const { data: modules } = useSuspenseQuery(modulesQuery);

	return (
		<div className={style.page}>
			<Heading el="h1" size="24-32" className={style.title}>
				{m.library_title()}
			</Heading>

			<section className={style.section}>
				<Heading el="h2" size="20-24" className={style.title}>
					{m.library_all_modules({ count: modules.totalCount })}
				</Heading>

				{modules.items.length > 0 ? (
					<ul className={style.modules}>
						{modules.items.map((module) => (
							<li key={module.id} className={style.item}>
								<ModuleCard module={module} />
							</li>
						))}
					</ul>
				) : (
					<p className={style.empty}>{m.library_empty()}</p>
				)}
			</section>
		</div>
	);
}
