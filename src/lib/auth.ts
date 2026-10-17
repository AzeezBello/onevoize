import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export type UserRole = 'admin' | 'superadmin';

declare module 'next-auth' {
  interface User {
    id: string;
    role: UserRole;
  }
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: UserRole;
    };
  }
  interface JWT {
    id?: string;
    role?: UserRole;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  session: { strategy: 'jwt' },
  pages: { signIn: '/dashboard/login' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token['id'] = user.id;
        token['role'] = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = (token['id'] as string) ?? '';
        session.user.role = (token['role'] as UserRole) ?? 'admin';
      }
      return session;
    },
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const rows = await db(
          'SELECT id, name, email, password, role FROM users WHERE email = $1 AND is_active = TRUE LIMIT 1',
          [credentials.email as string],
        );
        const user = rows[0];
        if (!user) return null;
        const valid = await bcrypt.compare(credentials.password as string, user.password as string);
        if (!valid) return null;
        return { id: String(user.id), name: user.name as string, email: user.email as string, role: user.role as UserRole };
      },
    }),
  ],
});
