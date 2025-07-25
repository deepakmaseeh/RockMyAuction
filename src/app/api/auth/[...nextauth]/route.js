// /src/app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials" // or any you use

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", required: true },
        password: { label: "Password", type: "password", required: true }
      },
      async authorize(credentials) {
        // Replace with your real auth logic:
        if (
          credentials.email === "test@example.com" &&
          credentials.password === "password123"
        ) {
          return { id: 1, name: "Test User", email: credentials.email }
        }
        return null
      }
    }),
    // Add other providers (e.g., Google) here if using
  ],
  pages: {
    signIn: "/auth/login",
    callbackUrl: '/dashboard'

    // add more custom pages if needed
  },
  // Add session/database callbacks if needed
}

// Correctly export both handlers for App Router
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
