import { useEffect, useId, useRef, useState } from 'react'
import { X } from 'lucide-react'

/**
 * BottomSheet — animated modal sheet using <dialog>.
 *
 * Improvements (ui-ux-pro-max):
 * - Exit animation: slides down before dialog.close() is called (~220ms)
 * - Backdrop: uses backdrop-filter blur via CSS ::backdrop
 * - Interruptible: escape key / backdrop click triggers graceful exit
 * - Drag handle: more prominent
 */
export function BottomSheet({ isOpen, onClose, title, children, action }) {
  const dialog  = useRef(null)
  const titleId = useId()

  // Track closing state to play exit animation before unmounting
  const [isClosing, setIsClosing] = useState(false)
  const closeTimerRef = useRef(null)

  const triggerClose = () => {
    if (isClosing) return
    setIsClosing(true)
    // Wait for exit animation to finish, then actually close
    closeTimerRef.current = setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 220)
  }

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    }
  }, [])

  useEffect(() => {
    const element = dialog.current
    if (!isOpen) return

    const previousFocus = document.activeElement
    const overflow      = document.body.style.overflow

    document.body.style.overflow = 'hidden'
    element.showModal()

    return () => {
      element.close()
      document.body.style.overflow = overflow
      previousFocus?.focus()
    }
  }, [isOpen])

  // Reset closing state when reopened
  useEffect(() => {
    if (isOpen) setIsClosing(false)
  }, [isOpen])

  return (
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      onCancel={e => { e.preventDefault(); triggerClose() }}
      onClick={e => { if (e.target === e.currentTarget) triggerClose() }}
      className="nakoo-sheet"
    >
      {isOpen && (
        <div
          className={`sheet-panel ${isClosing ? 'animate-slide-down-sheet' : 'animate-slide-up-sheet'}`}
        >
          {/* Drag handle */}
          <div className="mx-auto mt-3 mb-2 w-10 h-1.5 rounded-full bg-neutral-200/80 flex-shrink-0" />

          {/* Header */}
          <div className="flex items-center justify-between px-5 pb-3.5 border-b border-neutral-100 shrink-0">
            <h2 id={titleId} className="text-xl font-bold text-neutral-800">{title}</h2>
            <button
              autoFocus
              type="button"
              aria-label="Tutup panel"
              onClick={triggerClose}
              className="w-11 h-11 flex items-center justify-center rounded-full text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 active:scale-90 transition-all duration-150"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5">
            {children}
          </div>

          {/* Action footer */}
          {action && (
            <div className="sheet-action px-5 pt-4 border-t border-neutral-100 bg-white shrink-0">
              {action}
            </div>
          )}
        </div>
      )}
    </dialog>
  )
}
