import { Component, type ReactNode } from "react";

type ErrorBoundaryProps = Readonly<{
	children: ReactNode;
	fallback: (error: Error) => ReactNode;
}>;

type ErrorBoundarystate = Readonly<{
	error?: Error;
}>;

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundarystate> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = {};
	}

	static getDerivedStateFromError(error: Error) {
		return { error };
	}

	render() {
		if (this.state.error) {
			return this.props.fallback(this.state.error);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
