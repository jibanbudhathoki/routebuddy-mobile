export const apiEndpoints = {
	auth: {
		login: '/v1/auth/sign-in',
		register: '/v1/auth/register',
	},
	profile: '/v1/profile',
} as const;