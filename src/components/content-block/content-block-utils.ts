const youtubePathId = (url: URL) => {
	const host = url.hostname.replace(/^www\.|^m\./, "");
	if (host === "youtu.be") return url.pathname.split("/")[1];
	if (host !== "youtube.com" && host !== "youtube-nocookie.com")
		return undefined;
	if (url.pathname === "/watch") return url.searchParams.get("v") ?? undefined;
	const [, kind, id] = url.pathname.split("/");
	return kind === "shorts" || kind === "live" || kind === "embed"
		? id
		: undefined;
};

const youtubeId = (url: URL) => {
	const id = youtubePathId(url);
	return id && /^[\w-]{11}$/.test(id) ? id : undefined;
};

const vimeoId = (url: URL) => {
	const host = url.hostname.replace(/^www\./, "");
	const segments = url.pathname.split("/");
	const id =
		host === "vimeo.com"
			? segments[1]
			: host === "player.vimeo.com" && segments[1] === "video"
				? segments[2]
				: undefined;
	return id && /^\d+$/.test(id) ? id : undefined;
};

export const embedVideoUrl = (videoUrl: string) => {
	if (!URL.canParse(videoUrl)) return undefined;
	const url = new URL(videoUrl);

	const youtube = youtubeId(url);
	if (youtube) return `https://www.youtube-nocookie.com/embed/${youtube}`;

	const vimeo = vimeoId(url);
	if (vimeo) return `https://player.vimeo.com/video/${vimeo}`;

	return undefined;
};
