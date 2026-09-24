import { createFormHookContexts } from "@tanstack/react-form";

// Separate from ./index so the field components can read the context without
// importing the hook that is built out of them.
export const { fieldContext, formContext, useFieldContext, useFormContext } =
	createFormHookContexts();
