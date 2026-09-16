import Spinner from "assets/icons/spinner.svg?react";
import * as m from "lib/paraglide/messages";
import style from "./loading-indicator.module.scss";

const LoadingIndicator = () => (
	<div className={style.loadingIndicator}>
		<Spinner width="3em" />
		<p>{m.loading_message()}</p>
	</div>
);

export default LoadingIndicator;
