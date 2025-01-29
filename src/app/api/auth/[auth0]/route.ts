import { handleAuth, handleCallback, handleLogin } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
    login: handleLogin({
        authorizationParams: {
            audience: process.env.AUTH0_AUDIENCE,
            scope: 'openid profile email',
        },
    }),
    callback: handleCallback({
        // @ts-expect-error - The user is not typed
        async afterCallback(req, res) {
            try {
                const response = await fetch(`${process.env.BACKEND_URL}/api/v1/auth/test`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: res.user.email,
                        auth0Id: res.user.sub,
                    }),
                });

                if (!response.ok) {
                    console.error('Failed to send user data to backend');
                }
            } catch (error) {
                console.error('Error sending user data to backend:', error);
            }

            return res;
        },
    }),
});
