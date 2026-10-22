import type { ContentBlockResource } from "lib/heyapi";

import Image from "./image";
import Instruction from "./instruction";
import RichText from "./rich-text";
import TitledBlock from "./titled-block";
import Video from "./video";

type Props = {
	block: ContentBlockResource;
};

const ContentBlock = ({ block }: Props) => {
	if (!block.title && !hasContent(block)) {
		return null;
	}

	switch (block.type) {
		case "Text":
			return (
				<TitledBlock title={block.title}>
					<RichText html={block.body} />
				</TitledBlock>
			);
		case "Image":
			return (
				<TitledBlock title={block.title}>
					<Image src={block.fileUrl} />
				</TitledBlock>
			);
		case "Video":
			return (
				<TitledBlock title={block.title}>
					<Video
						fileUrl={block.fileUrl}
						videoUrl={block.videoUrl}
						title={block.title}
					/>
				</TitledBlock>
			);
		case "Instruction":
			return <Instruction block={block} />;
	}
};

const hasContent = (block: ContentBlockResource) => {
	switch (block.type) {
		case "Text":
			return Boolean(block.body);
		case "Image":
			return Boolean(block.fileUrl);
		case "Video":
			return Boolean(block.fileUrl || block.videoUrl);
		case "Instruction":
			return Boolean(block.body || block.fileUrl);
	}
};

export default ContentBlock;
