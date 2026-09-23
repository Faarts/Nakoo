import { RECIPE_DETAILS } from './recipeDetails'
import { api } from './api'
import { DUMMY_RECIPES } from '../../.mock/recipes'
import { DUMMY_ACTIVITIES } from '../../.mock/activities'

export const skillLabels = { motorik_halus: 'Motorik halus', motorik_kasar: 'Motorik kasar', kognitif: 'Kognitif', kreativitas: 'Kreativitas', sensori: 'Sensori', bahasa: 'Bahasa', sosial_emosional: 'Sosial & emosi' }
export const mealLabels = { breakfast: 'Sarapan', lunch: 'Makan siang', snack: 'Camilan', dinner: 'Makan malam' }
export const emptyFilters = () => ({ usia: '', tekstur: [], bahanUtama: [], alergen: [], metodeMasak: [], skill: [], durasi: '', tags: [] })
export function parseList(value) {
  if (Array.isArray(value)) return value
  try { const result = JSON.parse(value || '[]'); return Array.isArray(result) ? result : [] } catch { return [] }
}
export function ageMatches(range, selected) {
  if (!selected) return true
  const [min, max = min] = String(range).match(/\d+/g)?.map(Number) || []
  const [start, end = start] = String(selected).match(/\d+/g)?.map(Number) || []
  return Number.isFinite(min) && Number.isFinite(start) && min <= end && max > start
}
const normalize = value => String(value || '').toLowerCase().trim()
const allergenAliases = { dairy: 'susu sapi', milk: 'susu sapi', susu: 'susu sapi', egg: 'telur', eggs: 'telur', nuts: 'kacang' }
export const normalizeAllergen = value => allergenAliases[normalize(value)] || normalize(value)
export function filterCatalog(items, { query = '', category = 'all', filters = {} } = {}) {
  return items.filter(item => {
    if (!normalize(item.title).includes(normalize(query))) return false
    if (category !== 'all' && item.type !== category) return false
    if (!ageMatches(item.age_range, filters.usia)) return false
    if (filters.durasi && !(Number(item.duration) <= Number(filters.durasi))) return false
    if (filters.skill?.length && !filters.skill.some(s => parseList(item.skills).includes(s))) return false
    if (filters.tags?.length && !filters.tags.every(s => parseList(item.tags).includes(s))) return false
    if (filters.tekstur?.length && !filters.tekstur.some(s => normalize(item.texture).includes(normalize(s)))) return false
    if (filters.metodeMasak?.length && !filters.metodeMasak.some(s => normalize(item.method).includes(normalize(s)))) return false
    const ingredients = [item.title, ...parseList(item.ingredients).map(i => i.name || i)].join(' ')
    const ingredientWords = { Sayuran: /sayur|bayam|wortel|brokoli|buncis/i, Buah: /buah|pisang|apel|alpukat/i, Daging: /daging|ayam|sapi|bakso/i, Ikan: /ikan/i, Telur: /telur|omelet/i, Seafood: /udang|seafood/i, Susu: /susu/i, Keju: /keju/i, Kacang: /kacang/i, Alpukat: /alpukat/i }
    if (filters.bahanUtama?.length && !filters.bahanUtama.some(s => ingredientWords[s]?.test(ingredients))) return false
    const allergens = parseList(item.allergens).map(normalizeAllergen)
    if (filters.alergen?.some(s => allergens.includes(normalizeAllergen(s.replace('Tanpa ', ''))))) return false
    return true
  })
}
export async function loadCatalog(type) {
  const food = type === 'food'
  const fallback = food ? DUMMY_RECIPES : DUMMY_ACTIVITIES
  let items, preview = import.meta.env.VITE_USE_MOCK === 'true'
  try {
    if (!preview) { const res = await api.get(food ? '/api/recipes' : '/api/activities'); items = res[food ? 'recipes' : 'activities'] || [] }
  } catch { preview = true }
  if (preview) items = fallback
  return { preview, items: items.map((item, index) => {
    const local = fallback.find(entry => entry.title.toLowerCase() === item.title.toLowerCase())
    const imageIndex = local ? fallback.indexOf(local) : index
    return { ...(food ? RECIPE_DETAILS[local?.id] : {}), ...local, ...item, texture: item.texture || RECIPE_DETAILS[local?.id]?.tags?.find(tag => ['Halus', 'Lumat', 'Cincang', 'Finger Food'].includes(tag)) || (food && /puree|halus/i.test(item.title) ? 'Halus' : ''), method: item.method || RECIPE_DETAILS[local?.id]?.tags?.find(tag => ['Kukus', 'Tumis', 'Rebus', 'Panggang'].includes(tag)) || (food && /panggang/i.test(item.title) ? 'Panggang' : ''), image: item.image || item.image_url || local?.image || `/img/${food ? 'food' : 'act'}-${String(imageIndex % (food ? 8 : 3) + 1).padStart(2, '0')}.png` }
  }) }
}
