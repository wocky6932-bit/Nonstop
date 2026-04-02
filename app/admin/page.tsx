"use client"
import { useRouter } from 'next/navigation'
import { useSession } from "@/hooks/use-session"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Package, ShoppingBag, Users, LogOut, Home, TrendingUp, DollarSign, Calendar } from 'lucide-react'
import { useState, useEffect } from 'react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts'

export default function AdminPage() {
  const router = useRouter()
  const { session, loading: sessionLoading } = useSession()
  const [stats, setStats] = useState<any>(null)
  const [loadingStats, setLoadingStats] = useState(true)

  const handleSignOut = async () => {
    try {
      await fetch('/api/session', { method: 'DELETE' })
      window.location.href = "/auth/login"
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  useEffect(() => {
    if (!sessionLoading && (!session || !session.isAdmin)) {
      router.push("/auth/login")
      return
    }

    if (session?.isAdmin) {
      fetchStats()
    }
  }, [session, sessionLoading, router])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats')
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoadingStats(false)
    }
  }

  if (sessionLoading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>
  }

  if (!session || !session.isAdmin) {
    return null 
  }

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-wide">NONSTOP ADMIN</h1>
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="outline" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Accueil
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl tracking-wide">Tableau de bord</h2>
            <Button variant="outline" onClick={fetchStats} disabled={loadingStats}>
              Actualiser les données
            </Button>
          </div>

          {/* Cartes statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                  <DollarSign className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-gray-500 uppercase">Ventes Totales</span>
              </div>
              <h3 className="text-2xl font-bold">{loadingStats ? "..." : formatPrice(stats?.totalRevenue || 0)}</h3>
              <p className="text-sm text-gray-500 mt-1">Depuis le début</p>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Calendar className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-gray-500 uppercase">Ce Mois-ci</span>
              </div>
              <h3 className="text-2xl font-bold">{loadingStats ? "..." : formatPrice(stats?.currentMonthRevenue || 0)}</h3>
              <p className="text-sm text-gray-500 mt-1">Revenu mensuel</p>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-gray-500 uppercase">Cette Année</span>
              </div>
              <h3 className="text-2xl font-bold">{loadingStats ? "..." : formatPrice(stats?.yearlyRevenue || 0)}</h3>
              <p className="text-sm text-gray-500 mt-1">Total {new Date().getFullYear()}</p>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-gray-500 uppercase">Commandes</span>
              </div>
              <h3 className="text-2xl font-bold">{loadingStats ? "..." : stats?.totalOrders || 0}</h3>
              <p className="text-sm text-gray-500 mt-1">Confirmées</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Graphique de tendance */}
            <div className="lg:col-span-2 bg-white p-8 rounded-xl border shadow-sm">
              <h3 className="text-xl font-medium mb-8 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-gray-400" />
                Tendance des ventes mensuelles
              </h3>
              <div className="h-[300px] w-full">
                {loadingStats ? (
                  <div className="h-full flex items-center justify-center text-gray-400">Chargement du graphique...</div>
                ) : stats?.monthlyChartData?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.monthlyChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="label" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                      />
                      <Tooltip 
                        cursor={{ fill: '#f9fafb' }}
                        contentStyle={{ 
                          borderRadius: '8px', 
                          border: '1px solid #e5e7eb',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                        formatter={(value: number) => [formatPrice(value), 'Ventes']}
                      />
                      <Bar 
                        dataKey="amount" 
                        fill="#000" 
                        radius={[4, 4, 0, 0]}
                        barSize={40}
                      >
                        {stats.monthlyChartData.map((entry: any, index: number) => (
                           <Cell key={`cell-${index}`} fill={index === stats.monthlyChartData.length - 1 ? '#000' : '#374151'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">Aucune donnée de vente disponible</div>
                )}
              </div>
            </div>

            {/* Menu de navigation rapide */}
            <div className="space-y-6">
              <Link href="/admin/products">
                <div className="bg-white p-6 rounded-xl border hover:shadow-lg transition-all cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-black text-white rounded-lg group-hover:scale-110 transition-transform">
                        <Package className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium">Produits</h3>
                        <p className="text-sm text-gray-500">Gérer l'inventaire</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/admin/orders">
                <div className="bg-white p-6 rounded-xl border hover:shadow-lg transition-all cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-black text-white rounded-lg group-hover:scale-110 transition-transform">
                        <ShoppingBag className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium">Commandes</h3>
                        <p className="text-sm text-gray-500">Suivre les ventes</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/admin/clients">
                <div className="bg-white p-6 rounded-xl border hover:shadow-lg transition-all cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-black text-white rounded-lg group-hover:scale-110 transition-transform">
                        <Users className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium">Clients</h3>
                        <p className="text-sm text-gray-500">Base utilisateurs</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
