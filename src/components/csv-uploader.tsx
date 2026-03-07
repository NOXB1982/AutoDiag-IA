"use client"

import { useState, useRef } from "react"
import { Upload, X, FileCheck, AlertCircle } from "lucide-react"
import { importClientsFromCsv } from "@/app/actions/import"

interface CsvUploaderProps {
    onClose: () => void
    isAdmin?: boolean
    vendors?: { id: string; name: string }[]
}

export function CsvUploader({ onClose, isAdmin, vendors }: CsvUploaderProps) {
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
            setError("")
            setSuccess("")
        }
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0]
            if (droppedFile.type === "text/csv" || droppedFile.name.endsWith(".csv")) {
                setFile(droppedFile)
                setError("")
                setSuccess("")
            } else {
                setError("Por favor, carrega apenas ficheiros .csv")
            }
        }
    }

    const [selectedVendorId, setSelectedVendorId] = useState<string>("")

    const handleUpload = async () => {
        if (!file) {
            setError("Nenhum ficheiro selecionado.")
            return
        }

        try {
            setLoading(true)
            setError("")

            const text = await file.text()
            // Pass the selected vendor ID if the user is an admin
            const targetId = isAdmin && selectedVendorId ? selectedVendorId : undefined

            const result = await importClientsFromCsv(text, targetId)

            setSuccess(`Sucesso! Importados ${result.clientsCreated} clientes e ${result.debtsCreated} registos de dívida.`)
            setFile(null)
            if (fileInputRef.current) fileInputRef.current.value = ""

        } catch (err: any) {
            setError(err.message || "Ocorreu um erro ao processar o ficheiro.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-900">
                <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/80 px-6 py-4 dark:border-gray-800/30 dark:bg-gray-800/50">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Importar Lista de Clientes</h3>
                    <button onClick={onClose} className="rounded-full p-1.5 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {isAdmin && vendors && vendors.length > 0 && (
                        <div>
                            <label htmlFor="vendor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Atribuir clientes a:
                            </label>
                            <select
                                id="vendor"
                                value={selectedVendorId}
                                onChange={(e) => setSelectedVendorId(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm"
                            >
                                <option value="">A mim (Admin)</option>
                                {vendors.map((v) => (
                                    <option key={v.id} value={v.id}>
                                        {v.name}
                                    </option>
                                ))}
                            </select>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Estes clientes ficarão visíveis apenas para o vendedor selecionado.
                            </p>
                        </div>
                    )}

                    <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        className={`mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 dark:border-gray-700 ${file ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-300' : 'bg-white dark:bg-gray-900'
                            }`}
                    >
                        <div className="text-center">
                            {file ? (
                                <FileCheck className="mx-auto h-12 w-12 text-blue-500" aria-hidden="true" />
                            ) : (
                                <Upload className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" aria-hidden="true" />
                            )}
                            <div className="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-400">
                                <label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer rounded-md bg-transparent font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500 dark:text-blue-400"
                                >
                                    <span>{file ? "Trocar Ficheiro" : "Procurar Ficheiro CSV"}</span>
                                    <input id="file-upload" ref={fileInputRef} name="file-upload" type="file" accept=".csv" className="sr-only" onChange={handleFileChange} />
                                </label>
                                {!file && <p className="pl-1">ou arrasta-o para aqui</p>}
                            </div>
                            {file && <p className="text-xs leading-5 text-gray-900 dark:text-gray-100 mt-2 font-medium">{file.name}</p>}
                        </div>
                    </div>

                    <div className="rounded-md bg-blue-50 p-3 text-xs text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                        <strong>Exemplo de Cabeçalho:</strong> nome, whatsapp, endereco, divida_01_2026, divida_02_2026
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
                            <AlertCircle className="h-4 w-4" /> {error}
                        </div>
                    )}

                    {success && (
                        <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            <FileCheck className="h-4 w-4" /> {success}
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4 dark:border-gray-800/30 dark:bg-gray-800/80">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleUpload}
                        disabled={!file || loading}
                        className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
                    >
                        {loading ? "A importar..." : "Importar Base de Dados"}
                    </button>
                </div>
            </div>
        </div>
    )
}
