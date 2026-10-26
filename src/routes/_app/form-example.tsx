import { revalidateLogic } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import Button from "components/button/button";
import ButtonLink from "components/button/button-link";
import { ErrorText } from "components/error-text/error-text";
import { Form, FormButton, SubmitError } from "components/form";
import { Heading } from "components/heading/heading";
import Icon from "components/icon/icon";
import Modal from "components/modal/modal";
import Pill from "components/pill/pill";
import { submitHandler, useAppForm, useIsSubmitting } from "lib/forms";
import {
	getFieldErrors,
	mutateAndValidate,
	type ValidationProblemDetails,
} from "lib/forms/validation-helpers";
import { makePageTitle } from "lib/title";
import { useId, useRef, useState } from "react";
import z from "zod";

import style from "./form-example.module.scss";

const validationSchema = z.object({
	email: z.email(),
	postalCode: z.string().regex(/\d{4}\s?[a-zA-Z]{2}/, {
		error: "Vul een geldige postcode in",
	}),
	houseNumber: z.string().regex(/\d+/),
	houseNumberAdd: z.string(),
	agree: z.literal<boolean>(true),
	options: z.array(z.string()).min(1, "Kies minimaal één optie"),
	contact: z.string().min(1, "Kies een contactvoorkeur"),
	country: z.string().min(1, "Kies een land"),
	note: z.string(),
	memberId: z.string(),
	terms: z.string(),
});
type ValidationType = z.infer<typeof validationSchema>;

// oxlint-disable-next-line typescript/no-explicit-any -- whatever man
const fakeSubmit = async (_value: any, ok = true) =>
	new Promise((resolve, reject) =>
		setTimeout(() => {
			if (ok) {
				resolve({ message: "Success" });
			} else {
				// The backend's rfc9457 problem details use camelCase field names.
				reject({
					title: "Een of meer velden zijn niet correct ingevuld.",
					errors: {
						email: [
							"This email already exists",
							"Your emailaddress is unimaginative",
						],
						postalCode: [
							"Could not find an address with the data you supplied",
						],
					},
				} satisfies ValidationProblemDetails);
			}
		}, 500),
	);

export const Route = createFileRoute("/_app/form-example")({
	head: () => ({
		meta: [{ title: makePageTitle("Form test") }],
	}),
	component: FormTest,
	loader: () => ({
		allOptions: [
			{ label: "I like apples!", value: "apples" },
			{
				label: "I like puppies very much!",
				value: "puppies",
			},
			{ label: "I eat squirrels!", value: "squirrels" },
		],
		contactOptions: [
			{ label: "By e-mail", value: "email" },
			{ label: "By phone", value: "phone" },
		],
		countryOptions: [
			{ label: "Netherlands", value: "nl" },
			{ label: "Belgium", value: "be" },
		],
	}),
});

function FormTest() {
	const [disabled, setDisabled] = useState(false);
	const { allOptions, contactOptions, countryOptions } = Route.useLoaderData();

	const mutation = useMutation({
		mutationFn: ({ body }: { body: ValidationType }) => {
			// oxlint-disable-next-line no-console -- DEV: show what is submitted
			console.log("Will submit data:", body);
			return fakeSubmit(body, false);
		},
	});

	const defaultValues: ValidationType = {
		email: "test@test.nl",
		postalCode: "1234AZ",
		houseNumber: "123",
		houseNumberAdd: "",
		agree: false,
		options: [],
		contact: "",
		country: "",
		note: "",
		memberId: "KOM-000123",
		terms: "These terms are read-only.",
	};

	const form = useAppForm({
		defaultValues,
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: validationSchema,
			onSubmitAsync: ({ value }) =>
				mutateAndValidate(mutation, { body: value }),
		},
	});

	const isSubmitting = useIsSubmitting(form);

	return (
		<div className={style.page}>
			<Heading el="h1" size="16-18">
				Form example
			</Heading>

			<Form
				label="Form example"
				onSubmit={submitHandler(form)}
				disabled={disabled}
			>
				<form.AppField name="email">
					{(field) => (
						<field.Input
							label="Your e-mail"
							autoComplete="email"
							placeholder="name@organisation.nl"
						/>
					)}
				</form.AppField>

				<div className={style.address}>
					<form.AppField name="postalCode">
						{(field) => <field.Input label="Postal code" noError />}
					</form.AppField>
					<form.AppField name="houseNumber">
						{(field) => <field.Input label="House number" noError />}
					</form.AppField>
					<form.AppField name="houseNumberAdd">
						{(field) => <field.Input label="Addition" noError optional />}
					</form.AppField>
					<form.Subscribe
						selector={(state) =>
							getFieldErrors(state, [
								"postalCode",
								"houseNumber",
								"houseNumberAdd",
							])
						}
					>
						{(errors) =>
							errors.length > 0 ? (
								<ErrorText className={style.addressError}>{errors}</ErrorText>
							) : null
						}
					</form.Subscribe>
				</div>

				<form.AppField name="agree">
					{(field) => (
						<field.Checkbox
							hint="You have to agree to this!"
							label="Sure, whatever dude."
						/>
					)}
				</form.AppField>

				<form.AppField name="options">
					{(field) => (
						<field.CheckboxGroup
							label="Pick your options"
							options={allOptions}
						/>
					)}
				</form.AppField>

				<form.AppField name="contact">
					{(field) => (
						<field.RadioGroup
							label="How should we reach you?"
							options={contactOptions}
						/>
					)}
				</form.AppField>

				<form.AppField name="country">
					{(field) => <field.Select label="Country" options={countryOptions} />}
				</form.AppField>

				<form.AppField name="note">
					{(field) => (
						<field.Textarea label="Anything else?" optional rows={4} />
					)}
				</form.AppField>

				<form.AppField name="memberId">
					{(field) => <field.Input label="Member ID" readOnly />}
				</form.AppField>

				<form.AppField name="terms">
					{(field) => <field.Textarea label="Terms" rows={2} readOnly />}
				</form.AppField>

				<FormButton isSubmitting={isSubmitting}>Submit</FormButton>
				<SubmitError form={form} />
			</Form>
			<Button type="button" onClick={() => setDisabled((d) => !d)}>
				Toggle disabled state
			</Button>
			{!mutation.isSuccess && (
				<p className={style.devMessage}>
					DEV: to successfully submit, update the call to{" "}
					<code className={style.code}>fakeSubmit</code> in the mutation.
				</p>
			)}
			{mutation.isSuccess && <p className={style.success}>Success!</p>}

			<Heading el="h1" size="16-18">
				Button variants
			</Heading>
			<div className={style.buttonShowcase}>
				<Button>
					<Icon name="check" />
					Primary medium
				</Button>
				<Button size="large">
					<Icon name="check" />
					Primary large
				</Button>
				<Button disabled>
					<Icon name="check" />
					Primary disabled
				</Button>

				<Button variant="secondary">
					<Icon name="clipboard-list" />
					Secondary medium
				</Button>
				<Button variant="secondary" size="large">
					<Icon name="clipboard-list" />
					Secondary large
				</Button>
				<Button variant="secondary" disabled>
					<Icon name="clipboard-list" />
					Secondary disabled
				</Button>
				<Button variant="secondary">
					Icon after label
					<Icon name="chevron-down" />
				</Button>

				<Button variant="link">
					<Icon name="info" />
					Link medium
				</Button>
				<Button variant="link" disabled>
					<Icon name="info" />
					Link disabled
				</Button>

				<FormButton isSubmitting={false}>
					<Icon name="check" />
					FormButton idle
				</FormButton>
				<FormButton isSubmitting={true}>
					<Icon name="check" />
					FormButton submitting
				</FormButton>

				<ButtonLink to="/">
					<Icon name="info" />
					ButtonLink
				</ButtonLink>
				<ButtonLink to="/" variant="link">
					<Icon name="info" />
					ButtonLink link style
				</ButtonLink>
			</div>

			<Heading el="h1" size="16-18">
				Pill variants
			</Heading>
			<div className={style.pillShowcase}>
				<Pill>Uitgenodigd</Pill>
				<Pill variant="accent-strong">Uitgenodigd</Pill>
				<Pill variant="error">Verlopen</Pill>
				<Pill variant="success">Uitgenodigd</Pill>
				<Pill variant="accent">
					<Icon name="check" />
					With icon
				</Pill>
			</div>
			<Heading el="h1" size="16-18">
				Modal
			</Heading>
			<div className={style.buttonShowcase}>
				<InviteModalExample />
				<Modal
					trigger={<Button variant="secondary">Open confirm modal</Button>}
					title="Uitnodiging intrekken"
					description="Weet je zeker dat je deze uitnodiging wilt intrekken?"
					action={<Button>Intrekken</Button>}
				/>
			</div>
		</div>
	);
}

const inviteSchema = z.object({
	name: z.string().trim().min(1, "Vul een naam in"),
	email: z.email("Vul een geldig e-mailadres in"),
});
type InviteValues = z.infer<typeof inviteSchema>;

const inviteDefaultValues: InviteValues = { name: "", email: "" };

const fakeInvite = async (body: InviteValues) =>
	new Promise((resolve, reject) =>
		setTimeout(() => {
			if (body.email.endsWith("@fail.nl")) {
				reject({
					title: "Uitnodiging kon niet worden verstuurd.",
					errors: { email: ["Dit e-mailadres is al uitgenodigd"] },
				});
			} else {
				resolve({ message: "Success" });
			}
		}, 1500),
	);

function InviteModalExample() {
	const formId = useId();
	const nameRef = useRef<HTMLInputElement>(null);
	const [open, setOpen] = useState(false);
	const [invited, setInvited] = useState<string>();

	const mutation = useMutation({
		mutationFn: ({ body }: { body: InviteValues }) => fakeInvite(body),
	});

	const form = useAppForm({
		defaultValues: inviteDefaultValues,
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: inviteSchema,
			onSubmitAsync: ({ value }) =>
				mutateAndValidate(mutation, { body: value }),
		},
		onSubmit: ({ value }) => {
			setInvited(value.email);
			setOpen(false);
		},
	});

	const isSubmitting = useIsSubmitting(form);

	return (
		<>
			<Modal
				open={open}
				onOpenChange={setOpen}
				onOpenChangeComplete={(isOpen) => {
					if (!isOpen) form.reset();
				}}
				trigger={<Button>Open form modal</Button>}
				initialFocus={nameRef}
				title="Nieuwe uitnodiging"
				action={
					<FormButton
						form={formId}
						isSubmitting={isSubmitting}
						loadingLabel="Versturen..."
					>
						<Icon name="mail" />
						Versturen
					</FormButton>
				}
			>
				<Form
					id={formId}
					label="Nieuwe uitnodiging"
					className={style.modalForm}
					onSubmit={submitHandler(form)}
				>
					<form.AppField name="name">
						{(field) => (
							<field.Input
								ref={nameRef}
								label="Naam"
								autoComplete="name"
								placeholder="Volledige naam"
							/>
						)}
					</form.AppField>
					<form.AppField name="email">
						{(field) => (
							<field.Input
								label="E-mail"
								type="email"
								autoComplete="email"
								placeholder="Naam@organisatie.nl"
							/>
						)}
					</form.AppField>
					<SubmitError form={form} hideWhenFieldsFail />
				</Form>
			</Modal>
			{invited && <p>Uitnodiging verstuurd naar {invited}</p>}
		</>
	);
}
