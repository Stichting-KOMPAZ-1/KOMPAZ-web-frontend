import clsx from "clsx";
import { ClipboardList, Info, type LucideIcon } from "lucide-react";

import style from "./icon.module.scss";

/**
 * The icon vocabulary of the design system. Keys are lucide's own icon names,
 * so a name can be looked up directly on https://lucide.dev/icons.
 *
 * Holds components only. Never store labels here: Paraglide messages must be
 * called during render to follow locale changes, and this object is evaluated
 * once at module scope.
 */
const icons = {
	"clipboard-list": ClipboardList,
	info: Info,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof icons;

export type IconProps = {
	name: IconName;
	/** The design's px sizes, applied in rem so icons follow text zoom. */
	size?: 14 | 16 | 20;
	className?: string;
};

/**
 * A decorative icon. It is always hidden from assistive technology, so the
 * accessible name has to live on whatever control or text it sits in.
 *
 * For an icon-only control, put the name on the control itself:
 *
 * @example
 * <Button type="button" aria-label={m.home_title()}>
 * 	<Icon name="info" />
 * </Button>
 */
const Icon = ({ name, size = 16, className }: IconProps) => {
	const LucideGlyph = icons[name];

	return (
		<LucideGlyph
			aria-hidden="true"
			focusable="false"
			className={clsx(style.icon, style[`size-${size}`], className)}
		/>
	);
};

export default Icon;
