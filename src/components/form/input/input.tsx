import { Field } from "@base-ui/react/field";
import clsx from "clsx";
import Icon from "components/icon/icon";
import * as m from "lib/paraglide/messages";
import { useState } from "react";

import style from "./input.module.scss";

export type InputProps = Omit<Field.Control.Props, "className"> & {
	className?: string;
};

/**
 * The text control inside a `<Field>`.
 *
 * @example
 * <Input name="email" type="email" autoComplete="email" />
 */
export function Input({ className, type = "text", ...props }: InputProps) {
	const [revealed, setRevealed] = useState(false);
	const isPassword = type === "password";

	return (
		<div className={clsx(style.control, className)}>
			<Field.Control
				{...props}
				type={isPassword && revealed ? "text" : type}
				className={style.input}
			/>
			{isPassword && (
				<button
					type="button"
					className={style.reveal}
					aria-label={
						revealed ? m.forms_hide_password() : m.forms_show_password()
					}
					onClick={() => setRevealed((r) => !r)}
				>
					<Icon name={revealed ? "eye-off" : "eye"} size={14} />
				</button>
			)}
		</div>
	);
}

export default Input;
