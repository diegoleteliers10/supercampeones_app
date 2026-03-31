import { BottomNav } from "@/components/ui/bottom-nav";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken } from "@/lib/auth-session";

export default async function ScorerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = cookies().get("lk_session")?.value;
  const session = verifySessionToken(token);
  if (!session || (session.rol !== "planillero" && session.rol !== "admin")) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-bg-secondary pb-20">
      <main className="min-h-screen">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
