"use client"

import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { FileDown } from "lucide-react"

interface DailyReportButtonProps {
    dateString: string
    kmInitial: number
    kmFinal: number
    kmTotal: number
    userName: string
    totalReceived: number
    visits: any[]
}

export function DailyReportButton({
    dateString,
    kmInitial,
    kmFinal,
    kmTotal,
    userName,
    totalReceived,
    visits
}: DailyReportButtonProps) {

    const generatePDF = () => {
        const doc = new jsPDF()

        // Posições base
        let yPos = 20

        // Cabeçalho
        doc.setFontSize(20)
        doc.setTextColor(37, 99, 235) // blue-600
        doc.text("CRM Visitas - Relatório de Fecho Diário", 14, yPos)
        yPos += 15

        doc.setFontSize(11)
        doc.setTextColor(50, 50, 50)
        doc.text(`Data do Relatório: ${dateString}`, 14, yPos)
        doc.text(`Vendedor / Colaborador: ${userName}`, 110, yPos)
        yPos += 12

        // Resumo Seção
        doc.setFontSize(14)
        doc.setTextColor(0, 0, 0)
        doc.text("Resumo Global", 14, yPos)
        yPos += 6

        doc.setFontSize(11)
        doc.setTextColor(50, 50, 50)
        doc.text(`KM Inicial (Saída): ${kmInitial}`, 14, yPos)
        doc.text(`KM Final (Chegada): ${kmFinal}`, 80, yPos)
        doc.text(`Total Percorrido: ${kmTotal} km`, 150, yPos)
        yPos += 8

        doc.text(`Faturação Diária / Recebimentos: ${totalReceived.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}`, 14, yPos)
        yPos += 15

        // Tabela de Visitas
        if (visits && visits.length > 0) {
            doc.setFontSize(14)
            doc.setTextColor(0, 0, 0)
            doc.text("Histórico de Visitas Deste Dia", 14, yPos)
            yPos += 5

            const tableColumn = ["Hora", "Cliente", "Tipo", "Estado", "Recebido", "Notas"]
            const tableRows = visits.map(v => {
                const visitTime = new Date(v.date).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
                const amountFormatted = v.receiptAmount ? v.receiptAmount.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' }) : '-'

                return [
                    visitTime,
                    v.client?.name || "-",
                    v.type,
                    v.status,
                    amountFormatted,
                    v.notes || ""
                ]
            })

            autoTable(doc, {
                startY: yPos,
                head: [tableColumn],
                body: tableRows,
                styles: { fontSize: 9 },
                headStyles: { fillColor: [37, 99, 235] }
            })
        } else {
            doc.setFontSize(11)
            doc.setTextColor(100, 100, 100)
            doc.text("Nenhuma visita registada neste dia.", 14, yPos)
        }

        // Rodapé
        const pageCount = (doc as any).internal.getNumberOfPages()
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i)
            doc.setFontSize(8)
            doc.setTextColor(150, 150, 150)
            doc.text(
                `Página ${i} de ${pageCount} - Gerado automaticamente pelo CRM Visitas`,
                14,
                doc.internal.pageSize.getHeight() - 10
            )
        }

        // Download
        doc.save(`Relatorio_Diario_${dateString}.pdf`)
    }

    return (
        <button
            onClick={generatePDF}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
        >
            <FileDown className="h-4 w-4" />
            Exportar Relatório em PDF
        </button>
    )
}
