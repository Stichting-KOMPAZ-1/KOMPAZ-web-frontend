import {
	type ColumnDef,
	metaHelper,
	type RowData,
	tableFeatures,
	useTable,
} from "@tanstack/react-table";

import style from "./table.module.scss";

const features = tableFeatures({
	columnMeta: metaHelper<{ width?: string }>(),
});

export type TableColumn<TData extends RowData> = ColumnDef<
	typeof features,
	TData
>;

type Label = { "aria-labelledby": string } | { "aria-label": string };

type Props<TData extends RowData> = Label & {
	columns: TableColumn<TData>[];
	data: TData[];
};

export const Table = <TData extends RowData>({
	columns,
	data,
	...label
}: Props<TData>) => {
	const table = useTable({ features, columns, data });

	return (
		// oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a scrollable region needs focus so keyboard users can scroll it (WCAG 2.1.1)
		<section className={style.scroller} tabIndex={0} {...label}>
			<table className={style.table}>
				<colgroup>
					{table.getAllLeafColumns().map((column) => (
						<col
							key={column.id}
							style={{ inlineSize: column.columnDef.meta?.width }}
						/>
					))}
				</colgroup>
				<thead>
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<th
									key={header.id}
									scope="col"
									colSpan={header.colSpan}
									className={style.header}
								>
									{!header.isPlaceholder && (
										<table.FlexRender header={header} />
									)}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody>
					{table.getRowModel().rows.map((row) => (
						<tr key={row.id} className={style.row}>
							{row.getAllCells().map((cell) => (
								// oxlint-disable-next-line jsx-a11y/control-has-associated-label -- a data cell is not a control; its column header labels it
								<td key={cell.id} className={style.cell}>
									<table.FlexRender cell={cell} />
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</section>
	);
};
