import style from "./button.module.scss";

// TODO: This is work in progress and will be implemented in its own ticket.
// TODO: to serve as a form's submit button this still needs:
// - styling for `[aria-disabled="true"]` equal to `:disabled`. A submit button
//   gets `aria-disabled={isSubmitting}`, never `disabled`, because disabling
//   the focused element drops focus to <body> (see the forms skill).
// - optionally, registering it in `formComponents` in `lib/forms` so it reads
//   `isSubmitting` from the form context instead of every form wiring
//   `aria-disabled` and the loading label by hand.
type Props = React.ComponentPropsWithoutRef<"button">;
function Button({ children, type = "button", ...props }: Props) {
	return (
		<button type={type} className={style.button} {...props}>
			{children}
		</button>
	);
}

export default Button;
