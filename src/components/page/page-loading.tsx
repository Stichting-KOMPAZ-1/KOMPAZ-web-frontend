import LoadingIndicator from "components/loading-indicator/loading-indicator";

import style from "./page-loading.module.scss";

const PageLoading = () => (
	<div className={style.page}>
		<LoadingIndicator />
	</div>
);

export default PageLoading;
