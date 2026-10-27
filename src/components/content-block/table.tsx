import { Table as BaseTable, type TableColumn } from "components/table/table";
import type {
	ContentBlockResource,
	ContentBlockTableResource,
} from "lib/heyapi";
import * as m from "lib/paraglide/messages";
import { useId, useMemo } from "react";

import TitledBlock from "./titled-block";

type Row = ContentBlockTableResource["rows"][number];

type Props = {
	block: ContentBlockResource;
};

const Table = ({ block: { title, table } }: Props) => {
	const titleId = useId();
	const headers = table?.columns;
	const columns = useMemo(
		(): TableColumn<Row>[] =>
			(headers ?? []).map((header, index) => ({
				id: String(index),
				header,
				accessorFn: (row) => row[index] ?? "",
			})),
		[headers],
	);

	if (!table) {
		return null;
	}

	return (
		<TitledBlock title={title} titleId={titleId}>
			<BaseTable
				columns={columns}
				data={table.rows}
				{...(title
					? { "aria-labelledby": titleId }
					: { "aria-label": m.elearning_block_table() })}
			/>
		</TitledBlock>
	);
};

export default Table;
