// This layout is intentionally minimal — the login page must NOT be wrapped
// by the main dashboard layout (which would redirect unauthenticated users
// before they can even see the login form).
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
