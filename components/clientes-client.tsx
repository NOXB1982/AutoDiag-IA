"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, MessageCircle, MapPin, Upload } from "lucide-react"
import { CsvUploader } from "@/components/csv-uploader"

// Since this was a Server Component before, we'll accept clients as a prop
// to maintain the fast SSR hydration strategy while adding interactivity.
type ClientProps = {
    clients: any[]
    isAdmin?: boolean
    vendors?: { id: string; name: string }[]
}

export default function ClientesClient({ clients, isAdmin, vendors }: ClientProps) {
    const [isUploaderOpen, setIsUploaderOpen] = useState(false)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                        Meus Clientes
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {clients.length} {clients.length === 1 ? "cliente registado" : "clientes registados"}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsUploaderOpen(true)}
                        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        <Upload className="h-4 w-4" />
                        <span className="hidden sm:inline">Importar</span>
                    </button>
                    <Link
                        href="/clientes/novo"
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">O Novo Cliente</span>
                    </Link>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {clients.map((client) => {
                    const numberOnly = client.whatsapp.replace(/\D/g, "")
                    const isNegative = client.pendingBalance < 0
                    const hasBalance = client.pendingBalance > 0

                    return (
                        <div
                            key={client.id}
                            className="flex flex-col justify-between overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                        >
                            <div className="p-5">
                                <div className="flex items-start justify-between">
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1 hover:text-blue-600 transition-colors">
                                        <Link href={`/clientes/${client.id}`}>{client.name}</Link>
                                    </h3>
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${hasBalance
                                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500"
                                            : isNegative
                                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500"
                                                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                                            }`}
                                    >
                                        {client.pendingBalance.toLocaleString("pt-PT", {
                                            style: "currency",
                                            currency: "EUR",
                                        })}
                                    </span>
                                </div>

                                <div className="mt-4 flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                                    <span className="line-clamp-2">{client.address}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 border-t border-gray-100 bg-gray-50 px-5 py-3 dark:border-gray-800 dark:bg-gray-950/50">
                                <a
                                    href={`https://wa.me/${numberOnly}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-1 items-center justify-center gap-2 rounded-md bg-[#25D366]/10 px-4 py-2 text-sm font-medium text-[#25D366] transition-colors hover:bg-[#25D366]/20"
                                >
                                    <MessageCircle className="h-4 w-4" />
                                    WhatsApp
                                </a>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(client.address)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-1 items-center justify-center gap-2 rounded-md bg-blue-100 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                                >
                                    <MapPin className="h-4 w-4" />
                                    Mapa
                                </a>
                            </div>
                        </div>
                    )
                })}

                {clients.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 py-12 text-center dark:border-gray-800 dark:bg-gray-900/50">
                        <h3 className="mt-2 font-semibold text-gray-900 dark:text-gray-100">
                            Nenhum cliente
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Começa por adicionar um novo cliente à tua carteira.
                        </p>
                        <button
                            onClick={() => setIsUploaderOpen(true)}
                            className="mt-6 flex items-center gap-2 rounded-lg bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            <Upload className="h-4 w-4" />
                            Importar CSV
                        </button>
                    </div>
                )}
            </div>

            {isUploaderOpen && (
                <CsvUploader
                    onClose={() => setIsUploaderOpen(false)}
                    isAdmin={isAdmin}
                    vendors={vendors}
                />
            )}
        </div>
    )
}
