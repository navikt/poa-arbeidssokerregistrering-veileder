export interface ProblemDetails {
	type?: string;
	title: string;
	status: number;
	detail?: string;
	instance?: string;
	[key: string]: unknown; // For custom extensions
}

/**
 * Type guard to check if an object matches the ProblemDetails structure.
 */
export function isProblemDetails(error: unknown): error is ProblemDetails {
	return (
		error !== null &&
		typeof error === 'object' &&
		'title' in error &&
		typeof (error as ProblemDetails).title === 'string' &&
		'status' in error &&
		typeof (error as ProblemDetails).status === 'number'
	);
}
