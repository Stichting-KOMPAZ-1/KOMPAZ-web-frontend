import Spinner from "assets/icons/spinner.svg?react";
import * as m from "lib/paraglide/messages";
import { useEffect, useState } from "react";
import style from "./loading-indicator.module.scss";

// TODO: update the messages for your client! (probably one message is enough)
const messageFns = [
	m.loading_message_0,
	m.loading_message_1,
	m.loading_message_2,
	m.loading_message_3,
	m.loading_message_4,
];

const LoadingIndicator = () => {
	const [messageFn, setMessageFn] = useState(
		() =>
			messageFns[
				Math.floor(Math.random() * messageFns.length)
			],
	);

	useEffect(() => {
		const updateLoadingMessage = () => {
			let next = messageFn;
			while (next === messageFn) {
				next =
					messageFns[
						Math.floor(Math.random() * messageFns.length)
					];
			}
			setMessageFn(() => next);
		};

		const interval = setInterval(
			updateLoadingMessage,
			5000,
		);
		return () => clearInterval(interval);
	});

	return (
		<div className={style.loadingIndicator}>
			<Spinner width="3em" />
			<p>{messageFn()}</p>
		</div>
	);
};

export default LoadingIndicator;
