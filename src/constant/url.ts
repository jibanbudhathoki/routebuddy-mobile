export const apiEndpoints = {
	auth: {
		login: '/v1/auth/sign-in',
		register: '/v1/auth/register',
	},
	profile: {
		base: '/v1/profile',
		addresses: '/v1/profile/addresses',
	},
	trips: '/v1/trips',
	stores: '/v1/stores',
	cities: '/v1/cities',
	payments: {
		payment: '/v1/payments',
		checkout: '/v1/payments/checkout',
	},
	requests: '/v1/requests',
} as const;