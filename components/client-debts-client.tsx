"use client"

import { useState } from "react"
import { Plus, Wallet } from "lucide-react"
import { AddDebtModal } from "./add-debt-modal"

interface DebtRow {
    id: string
    month: number
    year: number
    amount: number
    amountPaid: number
    amountPending: number
    createdAt: Date
}

interface ClientDebtsClientProps {
    clientId: string
    initialDebts: DebtRow[]
}

const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
]

export function ClientDebtsClient({ clientId, initialDebts }: ClientDebtsClientProps) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)

    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4 dark:border-gray-800/50 dark:bg-gray-800/50">
                <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-gray-100">
                    <Wallet className="h-5 w-5 text-blue-500" />
                    Histórico de Dívidas Mensais
                </h3>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                >
                    <Plus className="h-4 w-4" />
                    Adicionar Dívida
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-800/30 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Mês/Ano</th>
                            <th scope="col" className="px-6 py-3">Pendente</th>
                            <th scope="col" className="px-6 py-3">Pago</th>
                            <th scope="col" className="px-6 py-3">Original</th>
                            <th scope="col" className="px-6 py-3">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {initialDebts.length === 0 ? (
                            <tr className="border-b bg-white dark:border-gray-800 dark:bg-gray-900">
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    Nenhuma dívida registada para este cliente.
                                </td>
                            </tr>
                        ) : (
                            initialDebts.map((debt) => {
                                const isClosed = debt.amountPending <= 0
                                return (
                                    <tr key={debt.id} className="border-b bg-white hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800/50">
                                        <th scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {monthNames[debt.month - 1]} / {debt.year}
                                        </th>
                                        <td className={`px-6 py-4 font-bold ${isClosed ? 'text-gray-500' : 'text-amber-600 dark:text-amber-500'}`}>
                                            {debt.amountPending.toLocaleString("pt-PT", { style: "currency", currency: "EUR" })}
                                        </td>
                                        <td className="px-6 py-4 text-green-600 dark:text-green-500">
                                            {debt.amountPaid.toLocaleString("pt-PT", { style: "currency", currency: "EUR" })}
                                        </td>
                                        <td className="px-6 py-4">
                                            {debt.amount.toLocaleString("pt-PT", { style: "currency", currency: "EUR" })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${isClosed
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                                                }`}>
                                                {isClosed ? 'Liquidada' : 'Em Aberto'}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {isAddModalOpen && (
                <AddDebtModal
                    clientId={clientId}
                    onClose={() => setIsAddModalOpen(false)}
                />
            )}
        </div>
    )
}
