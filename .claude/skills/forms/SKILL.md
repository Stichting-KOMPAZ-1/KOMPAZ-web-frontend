---
name: forms
description: >-
    How forms are built — the presentational controls in src/components/form,
    the TanStack Form bindings around them, and the rules that keep them
    accessible. Use whenever you add or change a form, a field, or a form
    control, or touch src/lib/forms. Encodes library behaviour.
---

# Forms

Three layers, in dependency order:

| Layer                                   | Holds                                 | Knows about         |
| --------------------------------------- | ------------------------------------- | ------------------- |
| `src/components/form/<control>/<control>.tsx` | Presentational control on base-ui | nothing about forms |
| `src/components/form/<control>/tsf-<control>.tsx` | The TanStack-bound version   | the field context   |
| `src/routes/…`                          | The forms themselves                  | the API             |

`src/components/form/index.ts` exports the presentational layer plus `Form`,
`SubmitError`, and `FormButton`. The submit button is `FormButton`. The `tsf-` connectors are deliberately **not**
exported there — they are only wired into `createFormHook` in
`src/lib/forms/index.tsx`, and reached through `field.` at a call site.

`src/routes/_app/form-example.tsx` is the living reference. Keep it working.

## Writing a form

```tsx
const mutation = useMutation({ mutationFn: someSdk });

const form = useAppForm({
	defaultValues,
	validationLogic: revalidateLogic(),
	validators: {
		onDynamic: validationSchema,
		onSubmitAsync: ({ value }) => mutateAndValidate(mutation, { body: value }),
	},
	onSubmit: () => navigate({ to: "/done" }),
});

const isSubmitting = useIsSubmitting(form);

<Form label={m.feature_form_label()} onSubmit={submitHandler(form)}>
	<form.AppField name="email">
		{(field) => <field.Input label={m.feature_email()} autoComplete="email" />}
	</form.AppField>
	<FormButton isSubmitting={isSubmitting} loadingLabel={m.common_loading()}>
		{m.common_save()}
	</FormButton>
	<SubmitError form={form} />
</Form>;
```

`<SubmitError>` goes directly under the submit button, in every form. After a
failed submit it shows the API's form-level error, or — when fields are at
fault — a generic note that points up to them. Each field keeps its own
inline error.

Every form uses `useAppForm` from `src/lib/forms`. Never a `useState` per
field, never a second form library.

`form.AppField` is what creates the field context the bound components read —
they cannot work without it. `field.Input` is the `tsf-input` connector;
reaching it through `field` is the only supported way to get at it.

Fields: `Input`, `Select`, `Textarea`, `Checkbox`, `CheckboxGroup`,
`RadioGroup`. Each wraps its control in a base-ui `<Field>` and renders its
own error. The call site passes presentation props only — `label`, `hint`,
`optional`, `options`, plus `className` for the form's own layout.

State that isn't a field — a wizard step, a "sent" flag — stays in `useState`.

All user-facing copy comes from `lib/paraglide/messages`, including option
labels and schema error messages. (The example route hardcodes strings on
purpose; it is not the pattern to copy.)

## Validation and errors

**The API call goes in `onSubmitAsync`, not in `onSubmit`.**
`mutateAndValidate(mutation, variables)` from `lib/forms/validation-helpers`
awaits the mutation and, on failure, returns `apiErrorToFormErrors(error)` —
the `{ form, fields }` shape TanStack Form splits itself: the banner text into
`state.errorMap.onSubmit`, each field message into that field's own error map.
It also clears them on the next attempt. The backend speaks rfc9457 problem
details, with camelCase field names matching the form's own.

Doing it the other way — calling the API in `onSubmit` and pushing errors in
with `setErrorMap` — leaves them stuck. `validateSync` skips any cause that has
no validator configured, so a hand-set `errorMap.onSubmit` is never cleared.

`onSubmit` therefore runs only on success, for side effects: navigate,
invalidate queries, flip to a done view.

**Checks that need no server go in `onDynamic`, with
`validationLogic: revalidateLogic()`** — required fields, formats, password
confirmation, other cross-field rules. It runs on submit until the first
attempt, then on every change: the error appears on submit, not mid-typing,
and clears the moment the field is fixed. Not `onChange` (errors while the
user is still typing) and not `onSubmit` (the error stays until the next
submit).

A failing `onDynamic` stops `handleSubmit` before `onSubmitAsync`, so an
invalid form never reaches the API. Server errors from `onSubmitAsync` keep
their own timing: they clear on the next submit, not while typing.

Never put the API call in `onDynamicAsync` — after the first failed submit it
would fire a request on every keystroke.

`onDynamic` takes a Standard Schema, so a zod schema goes there directly —
prefer a generated request schema over a hand-written one. Check two things
first: the schema rejects `""` for required strings (a plain `z.string()`
accepts it), and its messages are ones you would show a user — zod's defaults
are generic. For owned wording, pass a Paraglide message as the check's
`error`.

`apiErrorToFormErrors` always returns a non-empty `form`. A validator
returning nothing truthy counts as a pass, so without that fallback a 500
would render as a successful submit.

`defaultValues` is typed from the schema (`z.infer`), and each
`form.AppField name` is checked against it in turn.

### One message for a row of fields

A field takes `noError` to suppress its own message; the row then renders one
combined `<ErrorText>` from `getFieldErrors(state, [...names])` inside a
`form.Subscribe`. Use it only where the fields really answer one question — an
address, a date split over three boxes.

## Accessibility rules that are not optional

**Every option in a group needs its own `Field.Item`.** `Field.Root` puts one
generated `controlId` in a single `LabelableProvider`, and `useLabelableId`
ends `return controlId ?? defaultId` — the shared id wins and a per-option `id`
is discarded. Without `Field.Item` every radio or checkbox in a group is named
by the _first_ option's label, so the question cannot be answered with a screen
reader. `Field.Item` opens a fresh provider per option while still inheriting
the group's `messageIds`.

**`<Form>` uses base-ui's `Fieldset.Root`, not a native `<fieldset>`.** A
native `fieldset[disabled]` only reaches native controls; base-ui's checkbox
and radio render a `<span role="checkbox" tabindex="0">` and stay operable.
`FieldRoot` reads base-ui's own fieldset context, which a raw element never
provides. That fieldset is a real group in the a11y tree, so pass `<Form
label>` to name it.

**`<form>` carries `noValidate`.** Otherwise the browser intercepts submit and
shows its own tooltip in its own locale, bypassing the validators and
Paraglide. `Form` sets it; don't render a bare `<form>`.

**`<FieldError>` always takes an explicit `match`.** Without one base-ui falls
back to the native `ValidityState` and renders browser-locale text. The type
requires it.

**Never pass `validate` or `validationMode` to `<Field>`, and never use
base-ui's own `Form`.** TanStack Form owns validation; `<Field>` only receives
`invalid` / `touched` / `dirty`.

### Nothing gets `disabled` while a submit is in flight

A browser blurs the focused element the moment it becomes disabled. That is
true of the element's own `disabled` attribute and of `disabled` on an ancestor
`<fieldset>` alike — so during a submit, when the button is almost always the
focused element, either one drops focus to `<body>`.

So: **do not pass `isSubmitting` to `<Form disabled>`, and do not give a submit
button `disabled={isSubmitting}`.** Use `aria-disabled` instead — it announces
the control as unavailable while leaving it focusable. `FormButton` passes
`disabled` together with base-ui's `focusableWhenDisabled`, which is base-ui's
own way of getting this right, that's why `FormButton` is the default for a
submit button.

The click still fires; `submitHandler` drops it. That is the guard that
matters, and it covers Enter in a field as well, because both paths raise the
same `submit` event. TanStack does not guard this: its own check only fires
while `submissionAttempts <= 1`, so a second submit mid-flight goes through.

`<Form disabled>` itself is fine for other reasons — freezing a form until
something upstream resolves.

### Focus stays put after a failed submit

**Never move focus to a field after a failed submit.** The user stays on the
button and goes up to the error themselves. What makes the failure audible is
`<SubmitError>`: its `role="alert"` wrapper is always mounted, so the message
is announced the moment it is inserted. `useSubmitError` returns `undefined`
while a submit is in flight, and `SubmitError` keys its text on
`useSubmitAttempts`, so a repeated identical failure is announced again.

Do not render the message conditionally around the live region
(`{error && <div role="alert">…}`): a region created together with its text is
not reliably announced.

## base-ui specifics

`render` **replaces** the element rather than wrapping it. `Fieldset.Root
render={<RadioGroup />}` emits no `<fieldset>` at all, and `Fieldset.Legend`
renders a `<div>` — naming happens through `aria-labelledby`, which is
equivalent. It also hides nesting from the linter, so prefer real nesting when
there is a choice.

Controls emit `onValueChange(value, details)`, not `onChange(evt)`.

State is styled from data attributes — `[data-invalid]`, `[data-checked]`,
`[data-disabled]` — not from threaded props.

`formComponents` in `createFormHook` is empty, and should stay empty unless a
component genuinely needs the form from context.

## Repetition

Use `withForm` / `withFieldGroup` from `src/lib/forms` rather than copying
markup — they keep type safety without the caller naming generics. See
https://tanstack.com/form/latest/docs/framework/react/guides/form-composition

Extract a shared piece only on the second real caller, and name it for what it
is, not by kind.
