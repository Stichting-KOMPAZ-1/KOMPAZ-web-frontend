import { Heading } from "components/heading/heading";
import { LinkAnchor, Link } from "components/link/link";
import DOMPurify from "dompurify";
import parse, {
	type DOMNode,
	domToReact,
	Element,
	type HTMLReactParserOptions,
} from "html-react-parser";

import style from "./rich-text.module.scss";

const ALLOWED_TAGS = [
	"div",
	"p",
	"br",
	"strong",
	"em",
	"del",
	"a",
	"h1",
	"blockquote",
	"pre",
	"ul",
	"ol",
	"li",
];

const ALLOWED_URI_REGEXP = /^(?:https?:|mailto:|\/(?!\/)|#)/i;

const RichTextLink = ({
	href,
	children,
}: {
	href: string;
	children: React.ReactNode;
}) => {
	if (!URL.canParse(href, window.location.href)) return children;
	const url = new URL(href, window.location.href);

	if (href.startsWith("#") || url.protocol === "mailto:") {
		return (
			<LinkAnchor href={href} inline>
				{children}
			</LinkAnchor>
		);
	}

	if (url.origin === window.location.origin) {
		return (
			<Link
				to={url.pathname}
				search={Object.fromEntries(url.searchParams)}
				hash={url.hash.slice(1)}
				inline
			>
				{children}
			</Link>
		);
	}

	return (
		<LinkAnchor href={href} inline target="_blank">
			{children}
		</LinkAnchor>
	);
};

const options: HTMLReactParserOptions = {
	replace: (node) => {
		if (!(node instanceof Element)) return;
		// domhandler's ChildNode is wider than DOMNode; html-react-parser documents this cast.
		const children = domToReact(node.children as DOMNode[], options);

		switch (node.name) {
			case "div":
				return <p>{children}</p>;
			case "h1":
				return (
					<Heading el="h3" size="18-20">
						{children}
					</Heading>
				);
			case "a": {
				const href = node.attribs.href;
				if (!href) return <>{children}</>;

				return <RichTextLink href={href}>{children}</RichTextLink>;
			}
		}
	},
};

type Props = {
	html: string | null;
};

const RichText = ({ html }: Props) => {
	if (!html) {
		return null;
	}

	return (
		<div className={style.text}>
			{parse(
				DOMPurify.sanitize(html, {
					ALLOWED_TAGS,
					ALLOWED_ATTR: ["href"],
					ALLOWED_URI_REGEXP,
				}),
				options,
			)}
		</div>
	);
};

export default RichText;
