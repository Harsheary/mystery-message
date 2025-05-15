import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { DefaultUser } from 'next-auth';

// Define interface for the MongoDB User document
interface UserDocument {
  _id: {toString(): string}; // MongoDB ObjectId
  email: string;
  username: string;
  password: string;
  isVerified: boolean;
  isAcceptingMessages: boolean;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        identifier: { label: 'Email or Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error('Email/username and password required');
        }

        await dbConnect();
        
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          }) as UserDocument | null;

          if (!user) {
            throw new Error('No user found with this email or username');
          }

          if (!user.isVerified) {
            throw new Error('Please verify your account before logging in');
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isPasswordCorrect) {
            // Return user object with the properties defined in next-auth.d.ts
            return {
              id: user._id.toString(),
              email: user.email,
              name: user.username,
              _id: user._id.toString(),
              isVerified: user.isVerified,
              isAcceptingMessages: user.isAcceptingMessages,
              username: user.username,
            } as DefaultUser;
          } else {
            throw new Error('Incorrect password');
          }
        } catch (err: unknown) {
          const errorMessage = err instanceof Error ? err.message : 'Authentication error';
          throw new Error(errorMessage);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/sign-in',
  },
};