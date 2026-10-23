import { Dialog } from "@base-ui/react/dialog";
import Button from "components/button/button";
import Icon from "components/icon/icon";
import * as m from "lib/paraglide/messages";
import type React from "react";

import style from "./modal.module.scss";

type Props = Omit<
	React.ComponentPropsWithoutRef<typeof Dialog.Root>,
	"children"
> & {
	trigger?: React.ComponentPropsWithoutRef<typeof Dialog.Trigger>["render"];
	title: React.ReactNode;
	description?: React.ReactNode;
	children?: React.ReactNode;
	action?: React.ReactNode;
	cancelLabel?: React.ReactNode;
	initialFocus?: React.ComponentPropsWithoutRef<
		typeof Dialog.Popup
	>["initialFocus"];
};

function Modal({
	trigger,
	title,
	description,
	children,
	action,
	cancelLabel = m.modal_cancel(),
	initialFocus,
	...props
}: Props) {
	return (
		<Dialog.Root {...props}>
			{trigger && <Dialog.Trigger render={trigger} />}
			<Dialog.Portal>
				<Dialog.Backdrop className={style.backdrop} />
				<Dialog.Viewport className={style.viewport}>
					<Dialog.Popup className={style.popup} initialFocus={initialFocus}>
						<div className={style.header}>
							<div className={style.titleRow}>
								<Dialog.Title className={style.title}>{title}</Dialog.Title>
								<Dialog.Close
									className={style.close}
									aria-label={m.modal_close()}
								>
									<Icon name="x" />
								</Dialog.Close>
							</div>
							{description && (
								<Dialog.Description className={style.description}>
									{description}
								</Dialog.Description>
							)}
						</div>

						{children && <div className={style.body}>{children}</div>}

						{action && (
							<div className={style.actions}>
								<Dialog.Close
									className={style.cancel}
									render={<Button variant="link" />}
								>
									{cancelLabel}
								</Dialog.Close>
								<div className={style.action}>{action}</div>
							</div>
						)}
					</Dialog.Popup>
				</Dialog.Viewport>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

export default Modal;
