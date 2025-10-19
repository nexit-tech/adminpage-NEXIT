'use client'
import { useState, useRef, useEffect } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  isToday,
  startOfWeek,
  endOfWeek
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import './DatePicker.css'

export default function DatePicker({ 
  value, 
  onChange, 
  label,
  placeholder = 'Selecione uma data',
  required = false,
  disabled = false,
  minDate = null
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(value ? new Date(value) : new Date())
  const datePickerRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart, { locale: ptBR })
  const calendarEnd = endOfWeek(monthEnd, { locale: ptBR })

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const handleDateSelect = (date) => {
    const formattedDate = format(date, 'yyyy-MM-dd')
    onChange(formattedDate)
    setIsOpen(false)
  }

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const handleClear = () => {
    onChange('')
    setIsOpen(false)
  }

  const handleToday = () => {
    const today = new Date()
    const formattedDate = format(today, 'yyyy-MM-dd')
    onChange(formattedDate)
    setCurrentMonth(today)
  }

  const selectedDate = value ? new Date(value + 'T00:00:00') : null
  const displayValue = selectedDate ? format(selectedDate, 'dd/MM/yyyy', { locale: ptBR }) : ''

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  return (
    <div className="datepicker-wrapper" ref={datePickerRef}>
      {label && (
        <label className="datepicker-label">
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      
      <div 
        className={`datepicker-trigger ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={displayValue ? 'selected' : 'placeholder'}>
          {displayValue || placeholder}
        </span>
        <Calendar size={20} className="calendar-icon" />
      </div>

      {isOpen && (
        <div className="datepicker-dropdown">
          <div className="datepicker-header">
            <button type="button" className="nav-btn" onClick={handlePreviousMonth}>
              <ChevronLeft size={20} />
            </button>
            <span className="current-month">
              {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
            </span>
            <button type="button" className="nav-btn" onClick={handleNextMonth}>
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="datepicker-calendar">
            <div className="weekdays">
              {weekDays.map(day => (
                <div key={day} className="weekday">{day}</div>
              ))}
            </div>

            <div className="days-grid">
              {days.map((day, index) => {
                const isCurrentMonth = isSameMonth(day, currentMonth)
                const isSelected = selectedDate && isSameDay(day, selectedDate)
                const isTodayDate = isToday(day)
                const isDisabled = minDate && day < new Date(minDate)

                return (
                  <button
                    key={index}
                    type="button"
                    className={`
                      day-btn 
                      ${!isCurrentMonth ? 'other-month' : ''} 
                      ${isSelected ? 'selected' : ''} 
                      ${isTodayDate ? 'today' : ''}
                      ${isDisabled ? 'disabled' : ''}
                    `}
                    onClick={() => !isDisabled && handleDateSelect(day)}
                    disabled={isDisabled}
                  >
                    {format(day, 'd')}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="datepicker-footer">
            <button type="button" className="footer-btn" onClick={handleClear}>
              Limpar
            </button>
            <button type="button" className="footer-btn primary" onClick={handleToday}>
              Hoje
            </button>
          </div>
        </div>
      )}
    </div>
  )
}