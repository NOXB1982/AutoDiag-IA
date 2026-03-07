"use client"

import { useState } from "react"
import { updateProfile } from "@/app/actions/settings"
import { User, Lock, Save, CheckCircle2, Mail } from "lucide-react"

export function DefinicoesClient({
    initialName,
    initialEmail
}: {
    initialName: string,
    initialEmail: string
}) {
    const [name, setName] = useState(initialName)
    const [email, setEmail] = useState(initialEmail)
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ text: "", type: "" })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setMessage({ text: "", type: "" })

        if (newPassword && !currentPassword) {
            setMessage({ text: "Introduza a palavra-passe atual para definir uma nova.", type: "error" })
            return
        }

        if (!email.includes('@')) {
            setMessage({ text: "Introduza um endereço de email válido.", type: "error" })
            return
        }

        try {
            setLoading(true)
            await updateProfile({
                name,
                email,
                currentPassword: currentPassword || undefined,
                newPassword: newPassword || undefined
            })
            setMessage({ text: "Perfil atualizado com sucesso! Terás de usar o novo email na próxima vez que fizeres login.", type: "success" })
            setCurrentPassword("")
            setNewPassword("")
        } catch (err: any) {
            setMessage({ text: err.message || "Erro ao atualizar perfil.", type: "error" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                    Definições de Conta
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Altera o teu perfil público, email de login ou palavra-passe.
                </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-gray-100 border-b border-gray-100 pb-2 dark:border-gray-800">
                            <User className="h-5 w-5 text-blue-500" /> Perfil Principal
                        </h3>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Nome Público
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                                />
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Apresentado nos relatórios PFD da Viatura.
                                </p>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Email de Login
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Email utilizado para iniciar sessão.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-gray-100 border-b border-gray-100 pb-2 dark:border-gray-800">
                            <Lock className="h-5 w-5 text-blue-500" /> Segurança
                        </h3>
                        <div className="mt-4 space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Palavra-passe Atual
                                </label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={e => setCurrentPassword(e.target.value)}
                                    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                                    placeholder="Deixar em branco se não quiser alterar"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Nova Palavra-passe
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                                />
                            </div>
                        </div>
                    </div>

                    {message.text && (
                        <div className={`p-4 rounded-md text-sm font-medium flex items-center gap-2 ${message.type === 'success'
                                ? 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                            {message.type === 'success' && <CheckCircle2 className="h-4 w-4" />}
                            {message.text}
                        </div>
                    )}

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
                        >
                            <Save className="h-4 w-4" />
                            {loading ? "A Guardar..." : "Guardar Alterações"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
