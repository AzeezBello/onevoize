
import { Suspense } from 'react';
import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center">
          <p>Loading login...</p>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
