"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LayoutDashboard, FileText, GraduationCap, BarChart, BookOpen, LogOut, Menu, X, User } from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const navigation = [
    {
      name: "Inicio",
      href: "/dashboard",
      icon: LayoutDashboard,
      current: pathname === "/dashboard",
    },
    {
      name: "Perfil",
      href: "/profile",
      icon: User,
      current: pathname === "/profile",
    },
    {
      name: "CV",
      href: "/resume",
      icon: FileText,
      current: pathname === "/resume",
    },
    {
      name: "Tests",
      href: "/tests",
      icon: GraduationCap,
      current: pathname === "/tests" || pathname.startsWith("/tests/"),
    },
    {
      name: "Estadísticas",
      href: "/statistics",
      icon: BarChart,
      current: pathname === "/statistics",
    },
    {
      name: "Recomendaciones",
      href: "/recommendations",
      icon: BookOpen,
      current: pathname === "/recommendations",
    },
  ]

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  // Función para obtener las iniciales del nombre de usuario
  const getInitials = (name: string | undefined) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar para móvil */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-200 lg:hidden ${
          sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeSidebar}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-gradient-to-b from-primary/90 to-primary/70 text-white transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <span className="text-2xl font-bold">JOBSY</span>
            </Link>
            <button className="rounded-md p-1 hover:bg-white/10 lg:hidden" onClick={closeSidebar}>
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-6">
            <nav className="space-y-2 px-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center rounded-md px-4 py-3 text-sm font-medium transition-colors ${
                    item.current ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                  onClick={closeSidebar}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      item.current ? "text-white" : "text-white/80 group-hover:text-white"
                    }`}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {user && (
            <div className="border-t border-white/10 p-6">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 border border-white/20">
                  <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="bg-primary-foreground text-primary">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-white/70">{user.email}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                className="mt-4 w-full justify-start text-white/80 hover:bg-white/10 hover:text-white py-3"
                onClick={handleLogout}
              >
                <LogOut className="mr-3 h-5 w-5" />
                Cerrar sesión
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Barra superior */}
        <header className="bg-white shadow dark:bg-gray-800">
          <div className="flex h-16 items-center justify-between px-6">
            <button
              className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 lg:hidden"
              onClick={toggleSidebar}
            >
              <Menu size={24} />
            </button>

            <div className="flex items-center">
              {!user ? (
                <div className="flex space-x-3">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/login">Iniciar sesión</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href="/register">Registrarse</Link>
                  </Button>
                </div>
              ) : (
                <div className="hidden items-center lg:flex">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">{user.name}</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Contenido de la página */}
        <main className="flex-1 overflow-auto bg-gray-50 p-6 dark:bg-gray-900">{children}</main>
      </div>
    </div>
  )
}
