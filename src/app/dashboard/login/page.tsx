
import { Suspense } from 'react';
import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="dashboard-shell flex min-h-dvh items-center justify-center">
          <p>Loading login...</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
