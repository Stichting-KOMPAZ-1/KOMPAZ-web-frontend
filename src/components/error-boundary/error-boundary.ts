import {
	Component,
	type ErrorInfo,
	type ReactNode,
} from "react";

type ErrorBoundaryProps = Readonly<{
	children: ReactNode;
	fallback: (error: Error) => ReactNode;
}>;

type ErrorBoundarystate = Readonly<{
	error?: Error;
}>;

class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundarystate
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = {};
	}

	static getDerivedStateFromError(error: Error) {
		return { error };
	}

	// biome-ignore lint/correctness/noUnusedFunctionParameters: depends on project. Remove if not used
	componentDidCatch(error: Error, info: ErrorInfo) {
		// Maybe do some analytics here
	}

	render() {
		if (this.state.error) {
			return this.props.fallback(this.state.error);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
