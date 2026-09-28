import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mosaïque | Suivi des tâches",
  description: "Tableau de bord de gestion des tâches d'équipe",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
