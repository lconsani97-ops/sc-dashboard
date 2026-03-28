import React, { useState, useRef, useEffect } from "react";
import { Bell, Search, Menu, LogOut, User as UserIcon, Settings, Moon, Sun } from "lucide-react";
import { useAuth } from "@/store/AuthStore";
import { useCampaign } from "@/store/CampaignStore";
import { useTheme } from "@/store/ThemeStore";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function Header() {
  const { user, logout } = useAuth();
  const { filters, setFilter } = useCampaign();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null; // Fallback if no user is found, though protected route should handle this

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 sticky top-0 z-40 transition-colors duration-200">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <Menu size={24} />
        </button>
        <div className="relative hidden md:block w-96 lg:w-[28rem]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, cidade... (use ; para múltiplas buscas)"
            value={filters.globalSearch || ""}
            onChange={(e) => {
              setFilter("globalSearch", e.target.value);
              if (pathname !== "/eleitores" && e.target.value.trim().length > 0) {
                router.push("/eleitores");
              }
            }}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-podemos-green/50 focus:border-podemos-green transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-podemos-blue hover:bg-podemos-blue/5 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-podemos-green rounded-full border-2 border-white dark:border-gray-800"></span>
        </button>
        
        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>
        
        <div className="relative" ref={dropdownRef}>
          <div 
            className="flex items-center gap-3 cursor-pointer p-1 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-podemos-blue to-podemos-green flex items-center justify-center text-white text-sm font-bold shadow-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-tight">{user.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
            </div>
          </div>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30">
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
              </div>
              
              <div className="py-2">
                <Link 
                  href="/perfil"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-podemos-blue/5 dark:hover:bg-gray-700 hover:text-podemos-blue dark:hover:text-blue-400 transition-colors"
                >
                  <UserIcon size={16} />
                  Editar Perfil
                </Link>
                
                <div className="flex items-center justify-between px-4 py-2 w-full hover:bg-podemos-blue/5 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
                    Modo Escuro
                  </div>
                  <button
                    onClick={toggleTheme}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-podemos-blue focus:ring-offset-2 transition-colors ${
                      isDarkMode ? 'bg-podemos-blue' : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                  >
                    <span className="sr-only">Toggle dark mode</span>
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        isDarkMode ? 'translate-x-2' : '-translate-x-2'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-700 py-2">
                <button 
                  onClick={() => {
                    setIsProfileOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
                >
                  <LogOut size={16} />
                  Sair do Sistema
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
