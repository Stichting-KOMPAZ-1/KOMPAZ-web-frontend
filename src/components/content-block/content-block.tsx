import { Heading } from "components/heading/heading";
import type { ContentBlockResource } from "lib/heyapi";

import Image from "./image";
import RichText from "./rich-text";
import Video from "./video";

import style from "./content-block.module.scss";

type Props = {
	block: ContentBlockResource;
};

const ContentBlock = ({ block }: Props) => {
	if (!block.title && !hasContent(block)) {
		return null;
	}

	return (
		<section className={style.block}>
			{block.title && (
				<Heading el="h2" size="20-24">
					{block.title}
				</Heading>
			)}
			{blockMedia(block)}
		</section>
	);
};

const hasContent = (block: ContentBlockResource) => {
	switch (block.type) {
		case "Text":
			return Boolean(block.body);
		case "Image":
			return Boolean(block.fileUrl);
		case "Video":
			return Boolean(block.fileUrl || block.videoUrl);
	}
};

const blockMedia = (block: ContentBlockResource) => {
	switch (block.type) {
		case "Text":
			return <RichText html={block.body} />;
		case "Image":
			return <Image src={block.fileUrl} />;
		case "Video":
			return (
				<Video
					fileUrl={block.fileUrl}
					videoUrl={block.videoUrl}
					title={block.title}
				/>
			);
	}
};

export default ContentBlock;
