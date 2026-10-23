import { useState } from "react";
import z from "zod";

const storedSchema = z.array(z.string());

const storageKey = (blockId: string) => `kompaz.checkboxes.${blockId}`;

const readChecked = (blockId: string) => {
	try {
		const stored = window.localStorage.getItem(storageKey(blockId));
		if (stored === null) return [];
		const parsed = storedSchema.safeParse(JSON.parse(stored));
		return parsed.success ? parsed.data : [];
	} catch {
		return [];
	}
};

const writeChecked = (blockId: string, checked: string[]) => {
	try {
		window.localStorage.setItem(storageKey(blockId), JSON.stringify(checked));
	} catch {
		return;
	}
};

export const useStoredCheckboxes = (blockId: string) => {
	const [checked, setChecked] = useState(() => readChecked(blockId));

	const updateChecked = (next: string[]) => {
		setChecked(next);
		writeChecked(blockId, next);
	};

	return { checked, setChecked: updateChecked };
};
