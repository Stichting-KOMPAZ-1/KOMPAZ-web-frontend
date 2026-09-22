import clsx from "clsx";
import {
	Activity,
	BuildingComplex,
	ChartColumn,
	ChevronDown,
	ChevronRight,
	ClipboardList,
	Compass,
	FileText,
	GraduationCap,
	Inbox,
	Info,
	LayoutGrid,
	LogOut,
	type LucideIcon,
	Mail,
	Map,
	MessageCircle,
	MousePointerClick,
	PenLine,
	Plus,
	QrCode,
	Ruler,
	Share2,
	Shield,
	Sparkles,
	Target,
	Trash,
	TrendingUp,
	Upload,
	UserCog,
	UserPlus,
	Users,
	X,
} from "lucide-react";

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
	activity: Activity,
	"building-complex": BuildingComplex,
	"chart-column": ChartColumn,
	"chevron-down": ChevronDown,
	"chevron-right": ChevronRight,
	"clipboard-list": ClipboardList,
	compass: Compass,
	"file-text": FileText,
	"graduation-cap": GraduationCap,
	inbox: Inbox,
	info: Info,
	"layout-grid": LayoutGrid,
	"log-out": LogOut,
	mail: Mail,
	map: Map,
	"message-circle": MessageCircle,
	"mouse-pointer-click": MousePointerClick,
	"pen-line": PenLine,
	plus: Plus,
	"qr-code": QrCode,
	ruler: Ruler,
	"share-2": Share2,
	shield: Shield,
	sparkles: Sparkles,
	target: Target,
	trash: Trash,
	"trending-up": TrendingUp,
	upload: Upload,
	"user-cog": UserCog,
	"user-plus": UserPlus,
	users: Users,
	x: X,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof icons;

export type IconProps = {
	name: IconName;
	/** Sized relative to the surrounding text, so icons track it under text-only zoom. */
	size?: "s" | "m" | "l";
	className?: string;
};

/**
 * A decorative icon. It is always hidden from assistive technology, so the
 * accessible name has to live on whatever control or text it sits in.
 *
 * For an icon-only control, put the name on the control itself:
 *
 * @example
 * <Button type="button" aria-label={m.nav_logout()}>
 * 	<Icon name="log-out" />
 * </Button>
 */
const Icon = ({ name, size = "m", className }: IconProps) => {
	const LucideGlyph = icons[name];

	return (
		<LucideGlyph
			aria-hidden="true"
			focusable="false"
			className={clsx(style.icon, style[size], className)}
		/>
	);
};

export default Icon;
