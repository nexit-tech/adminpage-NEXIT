'use client'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import './Select.css'

export default function Select({ 
  options = [], 
  value, 
  onChange, 
  placeholder = 'Selecione uma opção',
  label,
  required = false,
  disabled = false
}) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef(null)

  const selectedOption = options.find(opt => opt.value === value)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (option) => {
    onChange(option.value)
    setIsOpen(false)
  }

  return (
    <div className="select-wrapper" ref={selectRef}>
      {label && (
        <label className="select-label">
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      
      <div 
        className={`select-trigger ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={selectedOption ? 'selected' : 'placeholder'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          size={20} 
          className={`select-arrow ${isOpen ? 'rotate' : ''}`}
        />
      </div>

      {isOpen && (
        <div className="select-dropdown">
          {options.map((option) => (
            <div
              key={option.value}
              className={`select-option ${value === option.value ? 'active' : ''}`}
              onClick={() => handleSelect(option)}
            >
              <span>{option.label}</span>
              {value === option.value && (
                <Check size={18} className="check-icon" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}