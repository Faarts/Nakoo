import { useNavigate, useLocation } from 'react-router-dom'
import { Heart, CheckCircle2 } from 'lucide-react'
import { BottomSheet } from './BottomSheet'
export function AuthPromptModal({ isOpen, onClose, title = 'Simpan ide untuk si kecil', message = 'Masuk atau daftar untuk menyimpan favorit dan menyusun rencana harian.' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const enter = initialTab => { onClose?.(); navigate('/login', { state: { from: location.pathname + location.search, initialTab } }) }
  return <BottomSheet isOpen={isOpen} onClose={onClose} title={title} action={<div className="space-y-2"><button type="button" onClick={() => enter('masuk')} className="w-full min-h-12 rounded-full bg-primary-500 text-primary-900 font-semibold">Masuk ke akun</button><button type="button" onClick={() => enter('daftar')} className="w-full min-h-12 rounded-full border border-primary-200 text-primary-900 font-medium">Daftar akun gratis</button><button type="button" onClick={onClose} className="w-full min-h-11 text-sm text-neutral-500">Lanjut jelajah</button></div>}>
    <div className="size-14 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-primary-50 text-nakoo-red-500"><Heart className="size-7" /></div>
    <p className="text-center text-sm leading-relaxed text-neutral-600 mb-5">{message}</p>
    <div className="rounded-2xl bg-nakoo-green-50 p-4 space-y-3">{['Simpan menu dan aktivitas favorit', 'Susun rencana sesuai kebutuhan si kecil'].map(text => <p key={text} className="flex items-center gap-2 text-sm"><CheckCircle2 className="size-4 shrink-0 text-nakoo-green-700" />{text}</p>)}</div>
  </BottomSheet>
}
