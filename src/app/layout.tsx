// import type { Metadata } from "next";
// import { Inter, Playfair_Display } from "next/font/google";
// import Providers from "@/components/Providers";
// import Navigation from "@/components/Navigation";
// import "./globals.css";

// const inter = Inter({ subsets: ["latin"] });
// const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' });

// export const metadata: Metadata = {
//   title: "EventSync | Vivez l'expérience",
//   description: "Plateforme d'événements premium",
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="fr" className={`${playfair.variable}`}>
//       <body className={inter.className}>
//         <Providers>
//           <Navigation />
//           <main className="pt-0">{children}</main>
//         </Providers>
//       </body>
//     </html>
//   );

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="fr">
//       <body className="font-sans"> {/* Utilise une classe Tailwind standard */}
//         <Providers>
//           <Navigation />
//           <main>{children}</main>
//         </Providers>
//       </body>
//     </html>
//   );
// }


import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className="antialiased bg-black min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  )
}