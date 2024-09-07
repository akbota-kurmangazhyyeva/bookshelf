// utils/authOptions.ts
import { AuthOptions, User } from "next-auth"
import { JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"
import axios from "axios"

const base_url = process.env.NEXT_PUBLIC_API_BASE_URL

export const authOptions: AuthOptions = {
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
          const res = await axios.post(`${base_url}/auth/login`,
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
              accessToken: res.data.accessToken,
              refreshToken: res.data.refreshToken,
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
    async jwt({ token, user }: { token: JWT, user: User | undefined }) {
      if (user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
      }
      return token
    },
    async session({ session, token }: { session: CustomSession, token: CustomJWT }) {
      session.accessToken = token.accessToken
      session.refreshToken = token.refreshToken
      return session
    }
  },
  pages: {
    signIn: "/auth/signin",
  }
}

// Define custom types
interface CustomUser extends User {
  accessToken?: string
  refreshToken?: string
}

interface CustomJWT extends JWT {
  accessToken?: string
  refreshToken?: string
}

interface CustomSession extends Omit<DefaultSession, "user"> {
  accessToken?: string
  refreshToken?: string
  user?: CustomUser
}

// Make sure to import these if they're not already imported
import { DefaultSession } from "next-auth"