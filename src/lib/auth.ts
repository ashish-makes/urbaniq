import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
// We're going to handle OAuth account creation manually instead of using the adapter
// since there are type issues with the adapter
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  // Not using the adapter due to type incompatibilities
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Log token and user info for debugging
      console.log('JWT callback - user:', user ? { ...user, password: undefined } : null);
      console.log('JWT callback - current token:', token);
      
      if (user) {
        // User object is available on sign in
        token.role = user.role as string;
        token.id = user.id;
      } else if (token.email) {
        // For OAuth sign-ins, user object might not have role info
        // Fetch the user from the database to get the role
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email as string },
            select: { id: true, role: true }
          });
          
          if (dbUser) {
            token.role = dbUser.role;
            token.id = dbUser.id;
            console.log('Updated token from database:', { role: dbUser.role, id: dbUser.id });
          } else {
            // If we get here, the user exists in the session but not in the database
            // Let's create them
            console.log('User exists in session but not in database. Creating user:', token.email);
            try {
              const newUser = await prisma.user.create({
                data: {
                  email: token.email as string,
                  name: token.name as string || 'Google User',
                  role: 'USER',
                  emailVerified: new Date(),
                }
              });
              console.log('Successfully created missing user:', newUser.id);
              token.id = newUser.id;
              token.role = 'USER';
            } catch (userCreateError) {
              console.error('Failed to create missing user:', userCreateError);
            }
          }
        } catch (error) {
          console.error('Error fetching user data for JWT:', error);
        }
      }
      
      // Log final token for debugging
      console.log('JWT callback - updated token:', token);
      return token;
    },
    async session({ session, token }) {
      console.log('Session callback - token:', token);
      
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      
      console.log('Session callback - updated session:', { ...session, user: session.user ? { ...session.user, password: undefined } : null });
      return session;
    },
    async signIn({ account, profile, user }) {
      console.log('SignIn callback - account:', account);
      console.log('SignIn callback - profile:', profile);
      
      // For Google OAuth, ensure user is properly created with default role
      if (account?.provider === 'google' && profile?.email) {
        try {
          // Check if user exists
          const existingUser = await prisma.user.findUnique({
            where: { email: profile.email }
          });

          if (existingUser) {
            // If user exists but doesn't have a role, set default role
            if (!existingUser.role) {
              await prisma.user.update({
                where: { email: profile.email },
                data: { role: 'USER' }
              });
              console.log('Updated existing Google user with default role');
            }
          } else {
            // Create the user manually since we're not using the adapter
            console.log('Creating new Google user:', profile.email);
            try {
              const newUser = await prisma.user.create({
                data: {
                  email: profile.email,
                  name: profile.name || 'Google User',
                  role: 'USER',
                  emailVerified: new Date(),
                }
              });
              
              // Also create the account linking
              await prisma.account.create({
                data: {
                  userId: newUser.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token as string || null,
                  id_token: account.id_token as string || null,
                  refresh_token: account.refresh_token as string || null,
                  expires_at: account.expires_at as number || null,
                  token_type: account.token_type as string || null,
                  scope: account.scope as string || null,
                }
              });
              
              console.log('Successfully created Google user and account');
            } catch (createError) {
              console.error('Error creating Google user:', createError);
            }
          }
        } catch (error) {
          console.error('Error handling Google sign in:', error);
        }
      }
      
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") {
        return true;
      }
      
      return true;
    }
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
    verifyRequest: '/verification-pending',
    newUser: '/signup'
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV !== 'production',
}; 