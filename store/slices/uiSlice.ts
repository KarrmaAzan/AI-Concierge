import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type UIState = {
  phase: 'idle' | 'booting' | 'active'
  selectedService: string | null
  viewed: string[]
}

const initialState: UIState = {
  phase: 'idle',
  selectedService: null,
  viewed: [],
}

const slice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setPhase: (s, a: PayloadAction<UIState['phase']>) => { s.phase = a.payload },
    setSelectedService: (s, a: PayloadAction<string>) => { s.selectedService = a.payload },
    markViewed: (s, a: PayloadAction<string>) => {
      if (!s.viewed.includes(a.payload)) s.viewed.push(a.payload)
    },
  },
})

export const { setPhase, setSelectedService, markViewed } = slice.actions
export default slice.reducer