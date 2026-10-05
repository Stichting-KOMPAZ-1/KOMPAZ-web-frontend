import clsx from "clsx";
import {
	Check,
	ChevronDown,
	ClipboardList,
	Eye,
	EyeOff,
	Info,
	LogOut,
	type LucideIcon,
	Mail,
	Shield,
	TriangleAlert,
	UserCog,
} from "lucide-react";

import style from "./icon.module.scss";

// Keys are lucide's own icon names, so a name can be looked up directly on
// https://lucide.dev/icons.
const icons = {
	check: Check,
	"chevron-down": ChevronDown,
	"clipboard-list": ClipboardList,
	eye: Eye,
	"eye-off": EyeOff,
	info: Info,
	"log-out": LogOut,
	mail: Mail,
	shield: Shield,
	"triangle-alert": TriangleAlert,
	"user-cog": UserCog,
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
