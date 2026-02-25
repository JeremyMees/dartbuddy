export interface TurnActionState {
  legId: string
  legUpdate?: { legId: string; winnerId: string; endedAt: string }
  setUpdate?: { setId: string; winnerId: string; endedAt: string }
  newLeg?: { setId: string; number: number }
  newSet?: { number: number }
  gameUpdate?: {
    activePlayerId?: string
    winnerId?: string | null
    completedAt?: string
    endReason?: string
  }
}

export interface TurnDiff {
  turnId: string
  newLegId?: string
  newSetId?: string
  newSetLegId?: string
}
