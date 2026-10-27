import { useCallback, useState } from "react";

export const useOverflowsInline = <T extends HTMLElement>() => {
	const [overflows, setOverflows] = useState(false);

	const ref = useCallback((element: T | null) => {
		if (!element) {
			return;
		}

		const measure = () =>
			setOverflows(element.scrollWidth > element.clientWidth);
		const observer = new ResizeObserver(measure);
		observer.observe(element);
		for (const child of element.children) {
			observer.observe(child);
		}

		return () => observer.disconnect();
	}, []);

	return { ref, overflows };
};
