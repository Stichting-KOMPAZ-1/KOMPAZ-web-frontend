import clsx from "clsx";
import {
	ArrowLeft,
	ArrowRight,
	Check,
	ChevronDown,
	ChevronRight,
	CircleQuestionMark,
	ClipboardList,
	Copy,
	Download,
	ExternalLink,
	Eye,
	EyeOff,
	FileText,
	GraduationCap,
	Info,
	Link,
	LogOut,
	type LucideIcon,
	Mail,
	Phone,
	Share2,
	Shield,
	TriangleAlert,
	UserCog,
	Video,
	X,
} from "lucide-react";

import style from "./icon.module.scss";

// Keys are lucide's own icon names, so a name can be looked up directly on
// https://lucide.dev/icons.
const icons = {
	"arrow-left": ArrowLeft,
	"arrow-right": ArrowRight,
	check: Check,
	"chevron-down": ChevronDown,
	"chevron-right": ChevronRight,
	"circle-question-mark": CircleQuestionMark,
	"clipboard-list": ClipboardList,
	copy: Copy,
	download: Download,
	"external-link": ExternalLink,
	eye: Eye,
	"eye-off": EyeOff,
	"file-text": FileText,
	"graduation-cap": GraduationCap,
	info: Info,
	link: Link,
	"log-out": LogOut,
	mail: Mail,
	phone: Phone,
	"share-2": Share2,
	shield: Shield,
	"triangle-alert": TriangleAlert,
	"user-cog": UserCog,
	video: Video,
	x: X,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof icons;

export type IconProps = {
	name: IconName;
	size?: 14 | 16 | 20 | 24;
	className?: string;
};

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
