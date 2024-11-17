// import type { NextAuthConfig } from 'next-auth';
// import GitHub from 'next-auth/providers/github';

// export default {
//     providers: [GitHub],
//     pages: {
//         signIn: '/login'
//     },
//     callbacks: {
//         async redirect({ url, baseUrl }) {
//             console.log('url', url);
//             // Redirect to the homepage after successful login
//             return url === baseUrl || url === `${baseUrl}/login` ? `${baseUrl}/` : url;
//         }
//     }
// } satisfies NextAuthConfig;
