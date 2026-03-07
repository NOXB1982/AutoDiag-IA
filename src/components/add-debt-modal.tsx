"use client"

import { useState } from "react"
import { addMonthlyDebt } from "@/app/actions/debts"
import { X, Calendar, DollarSign } from "lucide-react"

interface AddDebtModalProps {
    clientId: string
    onClose: () => void
}

export function AddDebtModal({ clientId, onClose }: AddDebtModalProps) {
    const defaultMonth = new Date().getMonth() + 1
    const defaultYear = new Date().getFullYear()

    const [month, setMonth] = useState<number>(defaultMonth)
    const [year, setYear] = useState<number>(defaultYear)
    const [amount, setAmount] = useState<string>("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        const numAmount = parseFloat(amount.replace(",", "."))
        if (isNaN(numAmount) || numAmount <= 0) {
            setError("Introduza um valor válido.")
            return
        }

        try {
            setLoading(true)
            await addMonthlyDebt(clientId, { month, year, amount: numAmount })
            onClose()
        } catch (err: any) {
            setError(err.message || "Erro ao adicionar dívida. Verifique se o mês já não existe.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-sm overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-900">
                <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/80 px-6 py-4 dark:border-gray-800/30 dark:bg-gray-800/50">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Adicionar Dívida Mensal</h3>
                    <button onClick={onClose} disabled={loading} className="rounded-full p-1.5 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Mês
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="12"
                                required
                                value={month}
                                onChange={e => setMonth(parseInt(e.target.value))}
                                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Ano
                            </label>
                            <input
                                type="number"
                                min="2000"
                                max="2050"
                                required
                                value={year}
                                onChange={e => setYear(parseInt(e.target.value))}
                                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Valor Original (€)
                        </label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <DollarSign className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                className="block w-full rounded-md border border-gray-300 bg-white pl-10 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                                placeholder="ex: 150.00"
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
                    )}

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
                        >
                            {loading ? "A Adicionar..." : "Adicionar Dívida"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
