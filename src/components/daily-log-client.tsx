"use client"

import { useState } from "react"
import { openDay, closeDay } from "@/app/actions/daily-log"
import { Car, CheckCircle2, Lock, Unlock } from "lucide-react"

export function DailyLogClient({
    dateString,
    kmInitial: _kmInitial,
    kmFinal: _kmFinal,
    isClosed
}: {
    dateString: string
    kmInitial?: number | null
    kmFinal?: number | null
    isClosed: boolean
}) {
    const [kmInitial, setKmInitial] = useState<number | "">(_kmInitial || "")
    const [kmFinal, setKmFinal] = useState<number | "">(_kmFinal || "")

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const isOpen = _kmInitial !== undefined && _kmInitial !== null && !isClosed

    async function handleOpenDay() {
        if (!kmInitial || typeof kmInitial !== "number") {
            setError("Introduz os KM Iniciais válidos.")
            return
        }
        try {
            setLoading(true)
            setError("")
            await openDay(dateString, kmInitial)
        } catch (err: any) {
            setError(err.message || "Erro ao iniciar o dia.")
        } finally {
            setLoading(false)
        }
    }

    async function handleCloseDay() {
        if (!kmFinal || typeof kmFinal !== "number") {
            setError("Introduz os KM Finais válidos.")
            return
        }
        if (typeof kmInitial === "number" && kmFinal < kmInitial) {
            setError("Os KM Finais têm de ser maiores que os Iniciais!")
            return
        }
        try {
            setLoading(true)
            setError("")
            await closeDay(dateString, kmFinal)
        } catch (err: any) {
            setError(err.message || "Erro ao encerrar o dia.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={`rounded-xl border p-6 shadow-sm transition-colors ${isClosed
            ? "border-green-200 bg-green-50/50 dark:border-green-900/50 dark:bg-green-900/10"
            : isOpen
                ? "border-blue-200 bg-blue-50/50 dark:border-blue-900/50 dark:bg-blue-900/10"
                : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
            }`}>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                <Car className={`h-5 w-5 ${isClosed ? 'text-green-600' : isOpen ? 'text-blue-600' : 'text-gray-500'}`} />
                {isClosed ? "Controlo Viatura (Encerrado)" : isOpen ? "Fechar Dia" : "Iniciar Dia (Ao Sair de Casa)"}
            </h3>

            {error && (
                <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    {error}
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        KM Iniciais
                    </label>
                    <div className="mt-1 flex gap-2">
                        <input
                            type="number"
                            value={kmInitial}
                            onChange={(e) => setKmInitial(e.target.value ? Number(e.target.value) : "")}
                            disabled={isOpen || isClosed || loading}
                            className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:disabled:bg-gray-900"
                            placeholder="Ex: 125000"
                        />
                        {!isOpen && !isClosed && (
                            <button
                                onClick={handleOpenDay}
                                disabled={loading}
                                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                            >
                                <Unlock className="mr-2 h-4 w-4" /> Iniciar
                            </button>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        KM Finais
                    </label>
                    <div className="mt-1 flex gap-2">
                        <input
                            type="number"
                            value={kmFinal}
                            onChange={(e) => setKmFinal(e.target.value ? Number(e.target.value) : "")}
                            disabled={!isOpen || isClosed || loading}
                            className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:disabled:bg-gray-900"
                            placeholder={!isOpen ? "Inicia o dia primeiro" : "Ex: 125150"}
                        />
                        {isOpen && !isClosed && (
                            <button
                                onClick={handleCloseDay}
                                disabled={loading}
                                className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600"
                            >
                                <Lock className="mr-2 h-4 w-4" /> Encerrar
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {isClosed && (
                <div className="mt-4 flex items-center gap-2 rounded-md bg-green-100 px-4 py-3 text-sm text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    <CheckCircle2 className="h-5 w-5" />
                    As visitas deste dia estão bloqueadas para edição após o fecho.
                </div>
            )}
        </div>
    )
}
