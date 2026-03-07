"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import timeGridPlugin from "@fullcalendar/timegrid"
import ptLocale from "@fullcalendar/core/locales/pt"
import { VisitDetailsModal } from "./visit-details-modal"

type VisitEvent = {
  id: string
  title: string
  date: Date
  type: string
  status: string
  notes?: string | null
  receiptAmount?: number | null
}

export function CalendarView({ visits }: { visits: VisitEvent[] }) {
  const router = useRouter()
  const [selectedVisit, setSelectedVisit] = useState<VisitEvent | null>(null)

  const events = visits.map((v) => {
    let color = "#eab308" // Amarelo (PENDENTE)
    if (v.status === "REALIZADA") {
      color = v.type === "RECEBIMENTO" ? "#22c55e" : "#3b82f6" // Verde (RECEBIMENTO) / Azul (VISITA)
    } else if (v.status === "CANCELADA") {
      color = "#ef4444" // Vermelho
    }

    return {
      id: v.id,
      title: v.title,
      date: v.date,
      backgroundColor: color,
      borderColor: color,
      display: "block",
      extendedProps: {
        type: v.type,
        status: v.status,
        notes: v.notes,
        receiptAmount: v.receiptAmount
      }
    }
  })

  const handleDateClick = (arg: { dateStr: string }) => {
    // Navigates to scheduler form with the selected date in query params
    router.push(`/visitas/nova?date=${arg.dateStr}`)
  }

  const handleEventClick = (arg: { event: any }) => {
    const matchingVisit = visits.find(v => v.id === arg.event.id)
    if (matchingVisit) {
      setSelectedVisit(matchingVisit)
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-2 sm:p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 w-full overflow-hidden">
      <div className="fc-theme-standard text-xs sm:text-sm">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          locales={[ptLocale]}
          locale="pt"
          headerToolbar={{
            left: "title",
            center: "",
            right: "prev,next,today",
          }}
          height="auto"
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          dayMaxEvents={3}
          eventClassNames="cursor-pointer font-semibold rounded-sm shadow-sm opacity-90 hover:opacity-100 transition-opacity"
        />
      </div>
      <style jsx global>{`
        .fc-theme-standard .fc-scrollgrid {
          border-color: var(--fallback-bc, rgba(0,0,0,0.2));
          border-width: 2px !important;
        }
        .fc-theme-standard td,
        .fc-theme-standard th {
          border-color: var(--fallback-bc, rgba(0,0,0,0.15));
          border-width: 2px !important;
        }
        
        /* Cabeçalho Azul */
        .fc-col-header-cell {
          background-color: #3b82f6 !important;
        }
        .fc-col-header-cell-cushion {
          color: white !important;
          padding: 8px 4px !important;
        }

        .dark .fc-theme-standard .fc-scrollgrid,
        .dark .fc-theme-standard td,
        .dark .fc-theme-standard th {
          border-color: rgba(255,255,255,0.2) !important;
        }
        .dark .fc-col-header-cell {
          background-color: #2563eb !important;
        }
        .dark .fc-col-header-cell-cushion {
          color: white !important;
        }
        .dark .fc-daygrid-day-number {
          color: rgba(255,255,255,0.8) !important;
        }
        
        /* Destaque do Dia Atual */
        .fc .fc-daygrid-day.fc-day-today {
          background-color: rgba(59, 130, 246, 0.05) !important;
          border: 3px solid #3b82f6 !important;
        }
        .dark .fc .fc-daygrid-day.fc-day-today {
          background-color: rgba(59, 130, 246, 0.15) !important;
          border-color: #60a5fa !important;
        }
        
        .fc-button-primary {
          background-color: #3b82f6 !important;
          border-color: transparent !important;
          border-radius: 8px !important;
          font-weight: 500 !important;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
        .fc-button-primary:hover {
          background-color: #2563eb !important;
        }
        .fc-event {
          border: none !important;
          padding: 2px 4px;
        }
        
        /* Mobile specific enhancements */
        @media (max-width: 640px) {
          .fc-header-toolbar {
             flex-direction: column;
             gap: 8px;
          }
          .fc-toolbar-title {
             font-size: 1.125rem !important;
          }
          .fc-event-title {
             font-size: 9px !important;
             white-space: normal !important;
          }
          .fc-daygrid-day-events {
             margin: 0 !important;
          }
        }
      `}</style>

      {/* Modal de Detalhes da Visita */}
      <VisitDetailsModal
        visit={selectedVisit}
        onClose={() => setSelectedVisit(null)}
      />
    </div>
  )
}
