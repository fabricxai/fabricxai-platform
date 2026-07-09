export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#101725] to-[#182336]">
      {children}
    </div>
  );
}
