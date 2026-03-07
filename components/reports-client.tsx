"use client"

import { useState } from "react"
import { ChevronDown, MapPin, Receipt, Car, Clock, FileText, MessageCircle } from "lucide-react"
import { DailyReportButton } from "@/components/daily-report-button"

interface VisitData {
    id: string
    date: Date
    type: string
    notes: string | null
    status: string
    receiptAmount: number | null
    client: {
        id: string
        name: string
        address: string
    }
}

interface ReportData {
    id: string
    dateString: string
    kmInitial: number
    kmFinal: number | null
    kmTotal: number | null
    closed: boolean
    visits: VisitData[]
    totalReceived: number
    user: {
        name: string
    }
}

export function ReportsClient({ reports }: { reports: ReportData[] }) {
    const [expandedIds, setExpandedIds] = useState<string[]>([])

    const toggleExpand = (id: string) => {
        setExpandedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    const shareWhatsApp = (report: ReportData) => {
        const lines = [
            `*Resumo de Dia* (${report.dateString})`,
            `👤 ${report.user?.name || "Vendedor"}`,
            ``,
            `*Viatura:*`,
            `KM Total: ${report.kmTotal} km`,
            ``,
            `*Financeiro:*`,
            `Cobrado: ${report.totalReceived.toLocaleString("pt-PT", { style: "currency", currency: "EUR" })}`,
            ``,
            `*Visitas (${report.visits.length}):*`
        ]

        report.visits.forEach(v => {
            lines.push(`- ${v.client.name} (${v.type})`)
        })

        const text = encodeURIComponent(lines.join('\n'))
        window.open(`https://wa.me/?text=${text}`, '_blank')
    }

    if (reports.length === 0) {
        return (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">Sem Relatórios</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Não existem dias encerrados ou trabalhados neste mês.
                </p>
            </div>
        )
    }

    const formatDate = (dateString: string) => {
        const [year, month, day] = dateString.split('-')
        return `${day}/${month}/${year}`
    }

    return (
        <div className="space-y-4">
            {reports.map((report) => {
                const isExpanded = expandedIds.includes(report.id)

                return (
                    <div
                        key={report.id}
                        className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all dark:border-gray-800 dark:bg-gray-900"
                    >
                        {/* Header Compacto (Sempre Visível) */}
                        <div
                            onClick={() => toggleExpand(report.id)}
                            className="flex cursor-pointer items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col items-center justify-center rounded-lg bg-blue-50 px-3 py-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                    <span className="text-sm font-bold">{report.dateString.split('-')[2]}</span>
                                    <span className="text-xs font-medium uppercase">{
                                        ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"][parseInt(report.dateString.split('-')[1]) - 1]
                                    }</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                        Resumo do Dia
                                    </h3>
                                    <div className="mt-1 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <Car className="h-3.5 w-3.5" />
                                            {report.kmTotal || 0} km
                                        </span>
                                        <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-500">
                                            <Receipt className="h-3.5 w-3.5" />
                                            {report.totalReceived.toLocaleString("pt-PT", { style: "currency", currency: "EUR" })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="hidden sm:flex flex-col items-end mr-4">
                                    <span className="text-xs text-gray-500">Visitas/Cobranças</span>
                                    <span className="font-semibold text-gray-900 dark:text-gray-100">{report.visits.length} feitas</span>
                                </div>
                                <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-transform ${isExpanded ? 'rotate-180 bg-blue-100 text-blue-600' : ''}`}>
                                    <ChevronDown className="h-5 w-5" />
                                </div>
                            </div>
                        </div>

                        {/* Detalhes Expandidos */}
                        {isExpanded && (
                            <div className="border-t border-gray-100 bg-gray-50/50 p-5 dark:border-gray-800 dark:bg-gray-800/20">
                                <div className="grid gap-6 md:grid-cols-2">
                                    {/* Info Viatura */}
                                    <div>
                                        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Dados da Viatura</h4>
                                        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <span className="block text-xs text-gray-500">KM Iniciais</span>
                                                    <span className="font-medium text-gray-900 dark:text-gray-100">{report.kmInitial}</span>
                                                </div>
                                                <div>
                                                    <span className="block text-xs text-gray-500">KM Finais</span>
                                                    <span className="font-medium text-gray-900 dark:text-gray-100">{report.kmFinal || 'N/A'}</span>
                                                </div>
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                                <span className="block text-xs text-gray-500">Total Percorrido</span>
                                                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{report.kmTotal || 0} km</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Lista de Visitas */}
                                    <div>
                                        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Atividade ({report.visits.length})</h4>
                                        <div className="space-y-3">
                                            {report.visits.length === 0 ? (
                                                <p className="text-sm text-gray-500">Sem visitas registadas neste dia.</p>
                                            ) : (
                                                report.visits.map(visit => (
                                                    <div key={visit.id} className="rounded-lg border border-gray-200 bg-white p-3 text-sm dark:border-gray-700 dark:bg-gray-800">
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <span className="font-medium text-gray-900 dark:text-gray-100">{visit.client.name}</span>
                                                            </div>
                                                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${visit.type === 'RECEBIMENTO'
                                                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                                                }`}>
                                                                {visit.type}
                                                            </span>
                                                        </div>
                                                        {visit.notes && (
                                                            <p className="mt-2 text-gray-600 dark:text-gray-400">"{visit.notes}"</p>
                                                        )}
                                                        {visit.receiptAmount && (
                                                            <p className="mt-2 font-semibold text-emerald-600 dark:text-emerald-400">
                                                                Cobrado: {visit.receiptAmount.toLocaleString("pt-PT", { style: "currency", currency: "EUR" })}
                                                            </p>
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 flex flex-wrap gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
                                    <DailyReportButton
                                        dateString={report.dateString}
                                        kmInitial={report.kmInitial}
                                        kmFinal={report.kmFinal || 0}
                                        kmTotal={report.kmTotal || 0}
                                        userName={report.user?.name || "Vendedor"}
                                        totalReceived={report.totalReceived}
                                        visits={report.visits}
                                    />
                                    <button
                                        onClick={() => shareWhatsApp(report)}
                                        className="flex items-center gap-2 rounded-md bg-[#25D366] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#20bd5a]"
                                    >
                                        <MessageCircle className="h-4 w-4" />
                                        Enviar Resumo (WhatsApp)
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
