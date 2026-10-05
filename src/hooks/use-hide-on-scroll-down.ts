import { useEffect, useState } from "react";

export const useHideOnScrollDown = (threshold: number) => {
	const [hidden, setHidden] = useState(false);

	useEffect(() => {
		let previousY = window.scrollY;

		const handleScroll = () => {
			const { scrollY } = window;
			setHidden(scrollY > threshold && scrollY > previousY);
			previousY = scrollY;
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, [threshold]);

	return hidden;
};
