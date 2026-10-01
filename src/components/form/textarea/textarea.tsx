import { Field } from "@base-ui/react/field";
import clsx from "clsx";

import style from "./textarea.module.scss";

export type TextareaProps = Omit<Field.Control.Props, "className"> & {
	rows?: number;
	className?: string;
};

export function Textarea({ className, rows = 4, ...props }: TextareaProps) {
	return (
		<div className={clsx(style.control, className)}>
			<Field.Control
				{...props}
				className={style.textarea}
				render={<textarea rows={rows} />}
			/>
		</div>
	);
}

export default Textarea;
