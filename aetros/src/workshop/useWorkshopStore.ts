import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WorkshopState, Segment, JTBDStatement, RankedItem, FitScore, BMCFields } from './types'
import { createEmptyWorkshop } from './exportSummary'
import { AETROS_DEFAULTS } from './defaults'
import { uid } from './exportSummary'

interface WorkshopStore extends WorkshopState {
  loadAetrosTemplate: () => void
  resetWorkshop: () => void
  setStep: (step: number) => void
  setProjectName: (name: string) => void
  setSegments: (segments: Segment[]) => void
  addSegment: () => void
  updateSegment: (id: string, patch: Partial<Segment>) => void
  removeSegment: (id: string) => void
  setJtbdStatements: (statements: JTBDStatement[]) => void
  addJtbd: (segmentId: string) => void
  updateJtbd: (id: string, patch: Partial<JTBDStatement>) => void
  setPains: (pains: RankedItem[]) => void
  addPain: (segmentId: string) => void
  updatePain: (id: string, patch: Partial<RankedItem>) => void
  removePain: (id: string) => void
  setGains: (gains: RankedItem[]) => void
  addGain: (segmentId: string) => void
  updateGain: (id: string, patch: Partial<RankedItem>) => void
  removeGain: (id: string) => void
  updateValueMap: (patch: Partial<WorkshopState['valueMap']>) => void
  addProductService: () => void
  updateProductService: (index: number, value: string) => void
  setPainReliever: (painId: string, description: string) => void
  setGainCreator: (gainId: string, description: string) => void
  setFitScore: (itemId: string, type: 'pain' | 'gain', coverage: FitScore['coverage'], mappedFeature: string) => void
  updateBmc: (patch: Partial<BMCFields>) => void
  autoFillBmcFromWorkshop: () => void
}

export const useWorkshopStore = create<WorkshopStore>()(
  persist(
    (set, get) => ({
      ...createEmptyWorkshop(),

      loadAetrosTemplate: () =>
        set({ ...createEmptyWorkshop(), ...AETROS_DEFAULTS, currentStep: 0 }),

      resetWorkshop: () => set(createEmptyWorkshop()),

      setStep: (step) => set({ currentStep: step }),

      setProjectName: (name) => set({ projectName: name }),

      setSegments: (segments) => set({ segments }),

      addSegment: () =>
        set((s) => ({
          segments: [
            ...s.segments,
            { id: uid(), name: '', situation: '', when: '', where: '' },
          ],
        })),

      updateSegment: (id, patch) =>
        set((s) => ({
          segments: s.segments.map((seg) => (seg.id === id ? { ...seg, ...patch } : seg)),
        })),

      removeSegment: (id) =>
        set((s) => ({
          segments: s.segments.filter((seg) => seg.id !== id),
          jtbdStatements: s.jtbdStatements.filter((j) => j.segmentId !== id),
          pains: s.pains.filter((p) => p.segmentId !== id),
          gains: s.gains.filter((g) => g.segmentId !== id),
        })),

      setJtbdStatements: (jtbdStatements) => set({ jtbdStatements }),

      addJtbd: (segmentId) =>
        set((s) => ({
          jtbdStatements: [
            ...s.jtbdStatements,
            {
              id: uid(),
              segmentId,
              situation: '',
              job: '',
              outcome: '',
              functional: '',
              emotional: '',
              social: '',
            },
          ],
        })),

      updateJtbd: (id, patch) =>
        set((s) => ({
          jtbdStatements: s.jtbdStatements.map((j) => (j.id === id ? { ...j, ...patch } : j)),
        })),

      setPains: (pains) => set({ pains }),

      addPain: (segmentId) =>
        set((s) => ({
          pains: [...s.pains, { id: uid(), segmentId, text: '', importance: 3, dimension: 'functional' }],
        })),

      updatePain: (id, patch) =>
        set((s) => ({
          pains: s.pains.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),

      removePain: (id) =>
        set((s) => ({
          pains: s.pains.filter((p) => p.id !== id),
          valueMap: {
            ...s.valueMap,
            painRelievers: s.valueMap.painRelievers.filter((pr) => pr.painId !== id),
          },
        })),

      setGains: (gains) => set({ gains }),

      addGain: (segmentId) =>
        set((s) => ({
          gains: [...s.gains, { id: uid(), segmentId, text: '', importance: 3, dimension: 'functional' }],
        })),

      updateGain: (id, patch) =>
        set((s) => ({
          gains: s.gains.map((g) => (g.id === id ? { ...g, ...patch } : g)),
        })),

      removeGain: (id) =>
        set((s) => ({
          gains: s.gains.filter((g) => g.id !== id),
          valueMap: {
            ...s.valueMap,
            gainCreators: s.valueMap.gainCreators.filter((gc) => gc.gainId !== id),
          },
        })),

      updateValueMap: (patch) =>
        set((s) => ({ valueMap: { ...s.valueMap, ...patch } })),

      addProductService: () =>
        set((s) => ({
          valueMap: {
            ...s.valueMap,
            productsServices: [...s.valueMap.productsServices, ''],
          },
        })),

      updateProductService: (index, value) =>
        set((s) => {
          const productsServices = [...s.valueMap.productsServices]
          productsServices[index] = value
          return { valueMap: { ...s.valueMap, productsServices } }
        }),

      setPainReliever: (painId, description) =>
        set((s) => {
          const existing = s.valueMap.painRelievers.find((pr) => pr.painId === painId)
          const painRelievers = existing
            ? s.valueMap.painRelievers.map((pr) =>
                pr.painId === painId ? { ...pr, description } : pr
              )
            : [...s.valueMap.painRelievers, { id: uid(), painId, description }]
          return { valueMap: { ...s.valueMap, painRelievers } }
        }),

      setGainCreator: (gainId, description) =>
        set((s) => {
          const existing = s.valueMap.gainCreators.find((gc) => gc.gainId === gainId)
          const gainCreators = existing
            ? s.valueMap.gainCreators.map((gc) =>
                gc.gainId === gainId ? { ...gc, description } : gc
              )
            : [...s.valueMap.gainCreators, { id: uid(), gainId, description }]
          return { valueMap: { ...s.valueMap, gainCreators } }
        }),

      setFitScore: (itemId, type, coverage, mappedFeature) =>
        set((s) => {
          const existing = s.fitScores.find((f) => f.itemId === itemId && f.type === type)
          const fitScores = existing
            ? s.fitScores.map((f) =>
                f.itemId === itemId && f.type === type
                  ? { ...f, coverage, mappedFeature }
                  : f
              )
            : [...s.fitScores, { itemId, type, coverage, mappedFeature }]
          return { fitScores }
        }),

      updateBmc: (patch) => set((s) => ({ bmc: { ...s.bmc, ...patch } })),

      autoFillBmcFromWorkshop: () => {
        const s = get()
        const segSummary = s.segments.map((seg) => seg.name).join('; ')
        const vpParts = s.jtbdStatements.slice(0, 2).map((j) => j.outcome).join('; ')
        set({
          bmc: {
            ...s.bmc,
            customerSegments: s.bmc.customerSegments || segSummary,
            valueProposition:
              s.bmc.valueProposition ||
              `ช่วยลูกค้า: ${vpParts || '—'} ผ่าน ${s.valueMap.productsServices.filter(Boolean).slice(0, 2).join(', ')}`,
          },
        })
      },
    }),
    { name: 'aetros-workshop' }
  )
)
