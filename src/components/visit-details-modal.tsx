"use client"

import { X, Calendar as CalendarIcon, MapPin, Receipt, FileText } from "lucide-react"

type VisitDetails = {
    id: string
    title: string
    date: Date
    type: string
    status: string
    notes?: string | null
    receiptAmount?: number | null
}

interface VisitDetailsModalProps {
    visit: VisitDetails | null
    onClose: () => void
}

export function VisitDetailsModal({ visit, onClose }: VisitDetailsModalProps) {
    if (!visit) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 pt-[10vh] backdrop-blur-sm sm:pt-0">
            <div
                className="relative w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-900"
                role="dialog"
                aria-modal="true"
            >
                {/* Header Modal */}
                <div className={`flex items-center justify-between px-6 py-4 ${visit.type === 'RECEBIMENTO'
                        ? 'bg-green-50/80 border-b border-green-100 dark:bg-green-900/20 dark:border-green-800/30'
                        : 'bg-blue-50/80 border-b border-blue-100 dark:bg-blue-900/20 dark:border-blue-800/30'
                    }`}>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Detalhes do Registo
                    </h3>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1.5 text-gray-500 hover:bg-gray-200/50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body Modal */}
                <div className="p-6 space-y-6">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Cliente</span>
                        <div className="mt-1 flex items-center gap-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                                {visit.title}
                            </span>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${visit.type === 'RECEBIMENTO'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                }`}>
                                {visit.type}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
                        <div className="flex flex-col gap-1">
                            <span className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400">
                                <CalendarIcon className="h-4 w-4" /> Data da Visita
                            </span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                {visit.date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400">
                                Estado Atual
                            </span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                {visit.status}
                            </span>
                        </div>
                    </div>

                    {visit.type === 'RECEBIMENTO' && visit.receiptAmount && (
                        <div>
                            <span className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400">
                                <Receipt className="h-4 w-4" /> Valor Recebido
                            </span>
                            <p className="mt-1 text-lg font-bold text-green-600 dark:text-green-400">
                                {visit.receiptAmount.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
                            </p>
                        </div>
                    )}

                    <div>
                        <span className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400">
                            <FileText className="h-4 w-4" /> Notas e Resumo
                        </span>
                        <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                            {visit.notes ? (
                                <p className="whitespace-pre-wrap leading-relaxed">{visit.notes}</p>
                            ) : (
                                <p className="italic text-gray-400 dark:text-gray-500">Sem notas adicionais.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Modal */}
                <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-800/80">
                    <button
                        onClick={onClose}
                        className="w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    )
}
