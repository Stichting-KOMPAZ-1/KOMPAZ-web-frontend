import { Anchor } from "components/link/link";
import * as m from "lib/paraglide/messages";

import { embedVideoUrl } from "./content-block-utils";

import style from "./video.module.scss";

type Props = {
	fileUrl: string | null;
	videoUrl: string | null;
	title: string | null;
};

const Video = ({ fileUrl, videoUrl, title }: Props) => {
	if (fileUrl) {
		return (
			// oxlint-disable-next-line jsx-a11y/media-has-caption -- the API has no caption track for uploaded videos
			<video className={style.video} src={fileUrl} controls />
		);
	}

	if (!videoUrl) {
		return null;
	}

	const embedUrl = embedVideoUrl(videoUrl);
	if (!embedUrl) {
		return (
			<Anchor href={videoUrl} className={style.link} target="_blank">
				{title ?? m.elearning_block_video_link()}
			</Anchor>
		);
	}

	return (
		<iframe
			className={style.video}
			src={embedUrl}
			title={title ?? m.elearning_block_video()}
			allow="encrypted-media; fullscreen; picture-in-picture"
			// oxlint-disable-next-line react/iframe-missing-sandbox -- the players need scripts and their own origin, which only allowlisted cross-origin hosts get
			sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
		/>
	);
};

export default Video;
