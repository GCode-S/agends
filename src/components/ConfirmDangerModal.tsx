import { AnimatePresence, motion } from 'motion/react'

interface ConfirmDangerModalProps {
  open: boolean
  title: string
  description: string
  confirmText: string
  cancelText?: string
  onCancel: () => void
  onConfirm: () => Promise<void>
}

export function ConfirmDangerModal({
  open,
  title,
  description,
  confirmText,
  cancelText = 'Cancelar',
  onCancel,
  onConfirm,
}: ConfirmDangerModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-end bg-zinc-950/45 p-0 sm:place-items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            className="w-full max-w-md rounded-t-3xl border border-rose-200 bg-white p-4 shadow-[0_25px_65px_rgba(190,24,93,.22)] sm:rounded-3xl sm:p-5"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-zinc-200 sm:hidden" />
            <h3 className="font-title text-3xl text-zinc-900">{title}</h3>
            <p className="mt-2 text-sm text-zinc-600">{description}</p>

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
              >
                {cancelText}
              </button>

              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  void onConfirm()
                }}
                className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                {confirmText}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
