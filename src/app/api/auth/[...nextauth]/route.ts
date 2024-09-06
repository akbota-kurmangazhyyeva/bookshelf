import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import axios from "axios"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        try {
          const res = await axios.post("https://walrus-app-7iw6c.ondigitalocean.app/auth/login", 
            {
              username: credentials.username,
              password: credentials.password,
            },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          )
          if (res.data.accessToken) {
            return {
              id: credentials.username,
              name: credentials.username,
              accessToken: res.data.access_token,
              refreshToken: res.data.refresh_token,
            }
          }
        } catch (error) {
          console.error("Authentication error:", error)
        }

        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.refreshToken = token.refreshToken
      return session
    }
  },
  pages: {
    signIn: "/auth/signin",
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }