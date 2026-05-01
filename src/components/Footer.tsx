"use client";
import Link from "next/link";
import { Calendar } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          
          {/* COLONNE LOGO & DESCRIPTION */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group w-fit">
              <div className="w-10 h-10 bg-[#2ecc71] rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:rotate-6 transition-transform">
                <Calendar className="w-5 h-5 text-black" />
              </div>
              <span className="font-black text-2xl tracking-tighter text-white">EventSync</span>
            </Link>
            <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
              La plateforme de gestion d'événements en temps réel pour les organisateurs et participants.
            </p>
          </div>

          {/* COLONNE NAVIGATION */}
          <div>
            <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-widest">Navigation</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="text-gray-500 hover:text-[#2ecc71] text-sm transition-colors">
                  Événements
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="text-gray-500 hover:text-[#2ecc71] text-sm transition-colors">
                  Mon Planning
                </Link>
              </li>
            </ul>
          </div>

          {/* COLONNE ADMIN */}
          <div>
            <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-widest">Admin</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/admin/dashboard" className="text-gray-500 hover:text-[#2ecc71] text-sm transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-gray-500 hover:text-[#2ecc71] text-sm transition-colors">
                  Connexion
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* BARRE INFÉRIEURE */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:row justify-between items-center gap-6">
          <p className="text-gray-600 text-[11px] uppercase tracking-widest font-medium">
            © {currentYear} EventSync. Tous droits réservés.
          </p>
          
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#2ecc71] animate-pulse"></div>
            <p className="text-gray-600 text-[11px] uppercase tracking-widest font-medium">
              Stockage local — vos données restent sur votre machine
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}