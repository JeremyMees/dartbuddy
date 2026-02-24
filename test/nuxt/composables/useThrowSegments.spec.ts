import { describe, expect, it } from 'vitest'

describe('useThrowSegments', () => {
  it('should initialize with empty thrown segments', () => {
    const { thrownSegments } = useThrownSegments()

    expect(thrownSegments.value).toEqual([])
  })

  it('should initialize with maxThrowsHit as false', () => {
    const { maxThrowsHit } = useThrownSegments()

    expect(maxThrowsHit.value).toBe(false)
  })

  it('should initialize with totalThrowScore as 0', () => {
    const { totalThrowScore } = useThrownSegments()

    expect(totalThrowScore.value).toBe(0)
  })

  it('should add a thrown segment', () => {
    const { thrownSegments, addThrownSegment } = useThrownSegments()

    addThrownSegment('T20')

    expect(thrownSegments.value).toEqual(['T20'])
  })

  it('should add multiple thrown segments', () => {
    const { thrownSegments, addThrownSegment } = useThrownSegments()

    addThrownSegment('T20')
    addThrownSegment('T19')
    addThrownSegment('D12')

    expect(thrownSegments.value).toEqual(['T20', 'T19', 'D12'])
  })

  it('should set maxThrowsHit to true when 3 segments are thrown', () => {
    const { maxThrowsHit, addThrownSegment } = useThrownSegments()

    addThrownSegment('T20')
    addThrownSegment('T19')
    addThrownSegment('D12')

    expect(maxThrowsHit.value).toBe(true)
  })

  it('should not add more than 3 segments', () => {
    const { thrownSegments, addThrownSegment } = useThrownSegments()

    addThrownSegment('T20')
    addThrownSegment('T19')
    addThrownSegment('D12')
    addThrownSegment('S5')

    expect(thrownSegments.value).toEqual(['T20', 'T19', 'D12'])
    expect(thrownSegments.value.length).toBe(3)
  })

  it('should calculate total throw score correctly', () => {
    const { totalThrowScore, addThrownSegment } = useThrownSegments()

    addThrownSegment('T20') // 60
    addThrownSegment('DB') // 50
    addThrownSegment('T20') // 60

    expect(totalThrowScore.value).toBe(170)
  })

  it('should include MISS in score calculation', () => {
    const { totalThrowScore, addThrownSegment } = useThrownSegments()

    addThrownSegment('T20') // 60
    addThrownSegment('MISS') // 0
    addThrownSegment('S5') // 5

    expect(totalThrowScore.value).toBe(65)
  })

  it('should reset thrown segments', () => {
    const { thrownSegments, addThrownSegment, resetThrownSegments } =
      useThrownSegments()

    addThrownSegment('T20')
    addThrownSegment('T19')
    addThrownSegment('D12')

    resetThrownSegments()

    expect(thrownSegments.value).toEqual([])
  })

  it('should reset maxThrowsHit after reset', () => {
    const { maxThrowsHit, addThrownSegment, resetThrownSegments } =
      useThrownSegments()

    addThrownSegment('T20')
    addThrownSegment('T19')
    addThrownSegment('D12')

    expect(maxThrowsHit.value).toBe(true)

    resetThrownSegments()

    expect(maxThrowsHit.value).toBe(false)
  })

  it('should reset totalThrowScore after reset', () => {
    const { totalThrowScore, addThrownSegment, resetThrownSegments } =
      useThrownSegments()

    addThrownSegment('T20')
    addThrownSegment('T19')

    expect(totalThrowScore.value).toBeGreaterThan(0)

    resetThrownSegments()

    expect(totalThrowScore.value).toBe(0)
  })

  it('should remove a thrown segment', () => {
    const { thrownSegments, addThrownSegment, removeThrownSegment } =
      useThrownSegments()

    addThrownSegment('T20')
    addThrownSegment('T19')
    addThrownSegment('D12')

    removeThrownSegment('T19')

    expect(thrownSegments.value).toEqual(['T20', 'D12'])
  })

  it('should remove the first occurrence of a segment', () => {
    const { thrownSegments, addThrownSegment, removeThrownSegment } =
      useThrownSegments()

    addThrownSegment('T20')
    addThrownSegment('T10')
    addThrownSegment('T20')

    removeThrownSegment('T20')

    expect(thrownSegments.value).toEqual(['T10', 'T20'])
    expect(thrownSegments.value.length).toBe(2)
  })

  it('should not error when removing non-existent segment', () => {
    const { thrownSegments, addThrownSegment, removeThrownSegment } =
      useThrownSegments()

    addThrownSegment('T20')

    removeThrownSegment('T19')

    expect(thrownSegments.value).toEqual(['T20'])
  })

  it('should update maxThrowsHit after removing a segment', () => {
    const { maxThrowsHit, addThrownSegment, removeThrownSegment } =
      useThrownSegments()

    addThrownSegment('T20')
    addThrownSegment('T19')
    addThrownSegment('D12')

    expect(maxThrowsHit.value).toBe(true)

    removeThrownSegment('D12')

    expect(maxThrowsHit.value).toBe(false)
  })

  it('should update totalThrowScore after removing a segment', () => {
    const { totalThrowScore, addThrownSegment, removeThrownSegment } =
      useThrownSegments()

    addThrownSegment('T20') // 60
    addThrownSegment('T20') // 60
    addThrownSegment('T20') // 60

    expect(totalThrowScore.value).toBe(180)

    removeThrownSegment('T20')

    expect(totalThrowScore.value).toBe(120)
  })

  it('should allow adding after removing when below max throws', () => {
    const { thrownSegments, addThrownSegment, removeThrownSegment } =
      useThrownSegments()

    addThrownSegment('T20')
    addThrownSegment('T19')
    addThrownSegment('D12')
    removeThrownSegment('D12')

    addThrownSegment('S5')

    expect(thrownSegments.value).toEqual(['T20', 'T19', 'S5'])
  })
})
