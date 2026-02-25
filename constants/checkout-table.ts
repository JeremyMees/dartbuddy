export interface DartThrow {
  segment: Segment
  score: number
}

export interface CheckoutResult {
  darts: DartThrow[]
  totalDarts: number
}

export const checkoutTable: Record<number, CheckoutResult> = {
  2: {
    darts: [{ segment: 'D1', score: 2 }],
    totalDarts: 1,
  },
  4: {
    darts: [{ segment: 'D2', score: 4 }],
    totalDarts: 1,
  },
  6: {
    darts: [{ segment: 'D3', score: 6 }],
    totalDarts: 1,
  },
  8: {
    darts: [{ segment: 'D4', score: 8 }],
    totalDarts: 1,
  },
  10: {
    darts: [{ segment: 'D5', score: 10 }],
    totalDarts: 1,
  },
  12: {
    darts: [{ segment: 'D6', score: 12 }],
    totalDarts: 1,
  },
  14: {
    darts: [{ segment: 'D7', score: 14 }],
    totalDarts: 1,
  },
  16: {
    darts: [{ segment: 'D8', score: 16 }],
    totalDarts: 1,
  },
  18: {
    darts: [{ segment: 'D9', score: 18 }],
    totalDarts: 1,
  },
  20: {
    darts: [{ segment: 'D10', score: 20 }],
    totalDarts: 1,
  },
  22: {
    darts: [{ segment: 'D11', score: 22 }],
    totalDarts: 1,
  },
  24: {
    darts: [{ segment: 'D12', score: 24 }],
    totalDarts: 1,
  },
  26: {
    darts: [{ segment: 'D13', score: 26 }],
    totalDarts: 1,
  },
  28: {
    darts: [{ segment: 'D14', score: 28 }],
    totalDarts: 1,
  },
  30: {
    darts: [{ segment: 'D15', score: 30 }],
    totalDarts: 1,
  },
  32: {
    darts: [{ segment: 'D16', score: 32 }],
    totalDarts: 1,
  },
  34: {
    darts: [{ segment: 'D17', score: 34 }],
    totalDarts: 1,
  },
  36: {
    darts: [{ segment: 'D18', score: 36 }],
    totalDarts: 1,
  },
  38: {
    darts: [{ segment: 'D19', score: 38 }],
    totalDarts: 1,
  },
  40: {
    darts: [{ segment: 'D20', score: 40 }],
    totalDarts: 1,
  },
  50: {
    darts: [{ segment: 'DB', score: 50 }],
    totalDarts: 1,
  },
  41: {
    darts: [
      { segment: 'S1', score: 1 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 2,
  },
  42: {
    darts: [
      { segment: 'S9', score: 9 },
      { segment: 'D16', score: 32 },
    ],
    totalDarts: 2,
  },
  43: {
    darts: [
      { segment: 'S3', score: 3 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 2,
  },
  44: {
    darts: [
      { segment: 'S4', score: 4 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 2,
  },
  45: {
    darts: [
      { segment: 'S5', score: 5 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 2,
  },
  46: {
    darts: [
      { segment: 'S6', score: 6 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 2,
  },
  47: {
    darts: [
      { segment: 'S7', score: 7 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 2,
  },
  48: {
    darts: [
      { segment: 'S8', score: 8 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 2,
  },
  49: {
    darts: [
      { segment: 'S9', score: 9 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 2,
  },
  51: {
    darts: [
      { segment: 'S11', score: 11 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 2,
  },
  52: {
    darts: [
      { segment: 'S12', score: 12 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 2,
  },
  53: {
    darts: [
      { segment: 'S13', score: 13 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 2,
  },
  54: {
    darts: [
      { segment: 'S14', score: 14 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 2,
  },
  55: {
    darts: [
      { segment: 'S15', score: 15 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 2,
  },
  56: {
    darts: [
      { segment: 'S16', score: 16 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 2,
  },
  57: {
    darts: [
      { segment: 'S17', score: 17 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 2,
  },
  58: {
    darts: [
      { segment: 'S18', score: 18 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 2,
  },
  59: {
    darts: [
      { segment: 'S19', score: 19 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 2,
  },
  60: {
    darts: [
      { segment: 'S20', score: 20 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 2,
  },
  61: {
    darts: [
      { segment: 'SB', score: 25 },
      { segment: 'D18', score: 36 },
    ],
    totalDarts: 2,
  },
  62: {
    darts: [
      { segment: 'T10', score: 30 },
      { segment: 'D16', score: 32 },
    ],
    totalDarts: 2,
  },
  63: {
    darts: [
      { segment: 'T9', score: 27 },
      { segment: 'D18', score: 36 },
    ],
    totalDarts: 2,
  },
  64: {
    darts: [
      { segment: 'T16', score: 48 },
      { segment: 'D8', score: 16 },
    ],
    totalDarts: 2,
  },
  65: {
    darts: [
      { segment: 'SB', score: 25 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 2,
  },
  66: {
    darts: [
      { segment: 'T10', score: 30 },
      { segment: 'D18', score: 36 },
    ],
    totalDarts: 2,
  },
  67: {
    darts: [
      { segment: 'T17', score: 51 },
      { segment: 'D8', score: 16 },
    ],
    totalDarts: 2,
  },
  68: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'D4', score: 8 },
    ],
    totalDarts: 2,
  },
  69: {
    darts: [
      { segment: 'T19', score: 57 },
      { segment: 'D6', score: 12 },
    ],
    totalDarts: 2,
  },
  70: {
    darts: [
      { segment: 'T10', score: 30 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 2,
  },
  71: {
    darts: [
      { segment: 'T13', score: 39 },
      { segment: 'D16', score: 32 },
    ],
    totalDarts: 2,
  },
  72: {
    darts: [
      { segment: 'T16', score: 48 },
      { segment: 'D12', score: 24 },
    ],
    totalDarts: 2,
  },
  73: {
    darts: [
      { segment: 'T19', score: 57 },
      { segment: 'D8', score: 16 },
    ],
    totalDarts: 2,
  },
  74: {
    darts: [
      { segment: 'T14', score: 42 },
      { segment: 'D16', score: 32 },
    ],
    totalDarts: 2,
  },
  75: {
    darts: [
      { segment: 'T17', score: 51 },
      { segment: 'D12', score: 24 },
    ],
    totalDarts: 2,
  },
  76: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'D8', score: 16 },
    ],
    totalDarts: 2,
  },
  77: {
    darts: [
      { segment: 'T19', score: 57 },
      { segment: 'D10', score: 20 },
    ],
    totalDarts: 2,
  },
  78: {
    darts: [
      { segment: 'T18', score: 54 },
      { segment: 'D12', score: 24 },
    ],
    totalDarts: 2,
  },
  79: {
    darts: [
      { segment: 'T19', score: 57 },
      { segment: 'D11', score: 22 },
    ],
    totalDarts: 2,
  },
  80: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'D10', score: 20 },
    ],
    totalDarts: 2,
  },
  81: {
    darts: [
      { segment: 'T19', score: 57 },
      { segment: 'D12', score: 24 },
    ],
    totalDarts: 2,
  },
  82: {
    darts: [
      { segment: 'DB', score: 50 },
      { segment: 'D16', score: 32 },
    ],
    totalDarts: 2,
  },
  83: {
    darts: [
      { segment: 'T17', score: 51 },
      { segment: 'D16', score: 32 },
    ],
    totalDarts: 2,
  },
  84: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'D12', score: 24 },
    ],
    totalDarts: 2,
  },
  85: {
    darts: [
      { segment: 'T15', score: 45 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 2,
  },
  86: {
    darts: [
      { segment: 'T18', score: 54 },
      { segment: 'D16', score: 32 },
    ],
    totalDarts: 2,
  },
  87: {
    darts: [
      { segment: 'T17', score: 51 },
      { segment: 'D18', score: 36 },
    ],
    totalDarts: 2,
  },
  88: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'D14', score: 28 },
    ],
    totalDarts: 2,
  },
  89: {
    darts: [
      { segment: 'T19', score: 57 },
      { segment: 'D16', score: 32 },
    ],
    totalDarts: 2,
  },
  90: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'D15', score: 30 },
    ],
    totalDarts: 2,
  },
  91: {
    darts: [
      { segment: 'T17', score: 51 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 2,
  },
  92: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'D16', score: 32 },
    ],
    totalDarts: 2,
  },
  93: {
    darts: [
      { segment: 'T19', score: 57 },
      { segment: 'D18', score: 36 },
    ],
    totalDarts: 2,
  },
  94: {
    darts: [
      { segment: 'T18', score: 54 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 2,
  },
  95: {
    darts: [
      { segment: 'T19', score: 57 },
      { segment: 'D19', score: 38 },
    ],
    totalDarts: 2,
  },
  96: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'D18', score: 36 },
    ],
    totalDarts: 2,
  },
  97: {
    darts: [
      { segment: 'T19', score: 57 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 2,
  },
  98: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'D19', score: 38 },
    ],
    totalDarts: 2,
  },
  100: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 2,
  },
  99: {
    darts: [
      { segment: 'T19', score: 57 },
      { segment: 'S10', score: 10 },
      { segment: 'D16', score: 32 },
    ],
    totalDarts: 3,
  },
  101: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'S9', score: 9 },
      { segment: 'D16', score: 32 },
    ],
    totalDarts: 3,
  },
  102: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'S10', score: 10 },
      { segment: 'D16', score: 32 },
    ],
    totalDarts: 3,
  },
  103: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'S11', score: 11 },
      { segment: 'D16', score: 32 },
    ],
    totalDarts: 3,
  },
  104: {
    darts: [
      { segment: 'T18', score: 54 },
      { segment: 'S10', score: 10 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 3,
  },
  105: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'S5', score: 5 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 3,
  },
  106: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'S6', score: 6 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 3,
  },
  107: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'S15', score: 15 },
      { segment: 'D16', score: 32 },
    ],
    totalDarts: 3,
  },
  108: {
    darts: [
      { segment: 'T19', score: 57 },
      { segment: 'S19', score: 19 },
      { segment: 'D16', score: 32 },
    ],
    totalDarts: 3,
  },
  109: {
    darts: [
      { segment: 'T19', score: 57 },
      { segment: 'S12', score: 12 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 3,
  },
  110: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'S10', score: 10 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 3,
  },
  111: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'S11', score: 11 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 3,
  },
  112: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'S12', score: 12 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 3,
  },
  113: {
    darts: [
      { segment: 'T19', score: 57 },
      { segment: 'S16', score: 16 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 3,
  },
  114: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'S14', score: 14 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 3,
  },
  115: {
    darts: [
      { segment: 'T19', score: 57 },
      { segment: 'S18', score: 18 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 3,
  },
  116: {
    darts: [
      { segment: 'T19', score: 57 },
      { segment: 'S19', score: 19 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 3,
  },
  117: {
    darts: [
      { segment: 'D20', score: 40 },
      { segment: 'S17', score: 17 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 3,
  },
  118: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'S18', score: 18 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 3,
  },
  119: {
    darts: [
      { segment: 'T19', score: 57 },
      { segment: 'S12', score: 12 },
      { segment: 'DB', score: 50 },
    ],
    totalDarts: 3,
  },
  120: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'S20', score: 20 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 3,
  },
  121: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'S11', score: 11 },
      { segment: 'DB', score: 50 },
    ],
    totalDarts: 3,
  },
  122: {
    darts: [
      { segment: 'T18', score: 54 },
      { segment: 'T18', score: 54 },
      { segment: 'D7', score: 14 },
    ],
    totalDarts: 3,
  },
  123: {
    darts: [
      { segment: 'T19', score: 57 },
      { segment: 'S16', score: 16 },
      { segment: 'DB', score: 50 },
    ],
    totalDarts: 3,
  },
  124: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'S14', score: 14 },
      { segment: 'DB', score: 50 },
    ],
    totalDarts: 3,
  },
  125: {
    darts: [
      { segment: 'DB', score: 50 },
      { segment: 'T17', score: 51 },
      { segment: 'D12', score: 24 },
    ],
    totalDarts: 3,
  },
  126: {
    darts: [
      { segment: 'T19', score: 57 },
      { segment: 'T19', score: 57 },
      { segment: 'D6', score: 12 },
    ],
    totalDarts: 3,
  },
  127: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'T17', score: 51 },
      { segment: 'D8', score: 16 },
    ],
    totalDarts: 3,
  },
  128: {
    darts: [
      { segment: 'T18', score: 54 },
      { segment: 'T14', score: 42 },
      { segment: 'D16', score: 32 },
    ],
    totalDarts: 3,
  },
  129: {
    darts: [
      { segment: 'T19', score: 57 },
      { segment: 'T16', score: 48 },
      { segment: 'D12', score: 24 },
    ],
    totalDarts: 3,
  },
  130: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'T20', score: 60 },
      { segment: 'DB', score: 50 },
    ],
    totalDarts: 3,
  },
  131: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'T13', score: 39 },
      { segment: 'D16', score: 32 },
    ],
    totalDarts: 3,
  },
  132: {
    darts: [
      { segment: 'DB', score: 50 },
      { segment: 'DB', score: 50 },
      { segment: 'D16', score: 32 },
    ],
    totalDarts: 3,
  },
  133: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'T19', score: 57 },
      { segment: 'D8', score: 16 },
    ],
    totalDarts: 3,
  },
  134: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'T14', score: 42 },
      { segment: 'D16', score: 32 },
    ],
    totalDarts: 3,
  },
  135: {
    darts: [
      { segment: 'DB', score: 50 },
      { segment: 'T15', score: 45 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 3,
  },
  136: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'T20', score: 60 },
      { segment: 'D8', score: 16 },
    ],
    totalDarts: 3,
  },
  137: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'T19', score: 57 },
      { segment: 'D10', score: 20 },
    ],
    totalDarts: 3,
  },
  138: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'T18', score: 54 },
      { segment: 'D12', score: 24 },
    ],
    totalDarts: 3,
  },
  139: {
    darts: [
      { segment: 'T19', score: 57 },
      { segment: 'T14', score: 42 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 3,
  },
  140: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'T20', score: 60 },
      { segment: 'D10', score: 20 },
    ],
    totalDarts: 3,
  },
  141: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'T19', score: 57 },
      { segment: 'D12', score: 24 },
    ],
    totalDarts: 3,
  },
  142: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'T14', score: 42 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 3,
  },
  143: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'T17', score: 51 },
      { segment: 'D16', score: 32 },
    ],
    totalDarts: 3,
  },
  144: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'T20', score: 60 },
      { segment: 'D12', score: 24 },
    ],
    totalDarts: 3,
  },
  145: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'T15', score: 45 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 3,
  },
  146: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'T18', score: 54 },
      { segment: 'D16', score: 32 },
    ],
    totalDarts: 3,
  },
  147: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'T17', score: 51 },
      { segment: 'D18', score: 36 },
    ],
    totalDarts: 3,
  },
  149: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'T19', score: 57 },
      { segment: 'D16', score: 32 },
    ],
    totalDarts: 3,
  },
  150: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'T18', score: 54 },
      { segment: 'D18', score: 36 },
    ],
    totalDarts: 3,
  },
  151: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'T17', score: 51 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 3,
  },
  152: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'T20', score: 60 },
      { segment: 'D16', score: 32 },
    ],
    totalDarts: 3,
  },
  153: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'T19', score: 57 },
      { segment: 'D18', score: 36 },
    ],
    totalDarts: 3,
  },
  154: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'T18', score: 54 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 3,
  },
  155: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'T19', score: 57 },
      { segment: 'D19', score: 38 },
    ],
    totalDarts: 3,
  },
  156: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'T20', score: 60 },
      { segment: 'D18', score: 36 },
    ],
    totalDarts: 3,
  },
  157: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'T19', score: 57 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 3,
  },
  158: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'T20', score: 60 },
      { segment: 'D19', score: 38 },
    ],
    totalDarts: 3,
  },
  160: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'T20', score: 60 },
      { segment: 'D20', score: 40 },
    ],
    totalDarts: 3,
  },
  161: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'T17', score: 51 },
      { segment: 'DB', score: 50 },
    ],
    totalDarts: 3,
  },
  164: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'T18', score: 54 },
      { segment: 'DB', score: 50 },
    ],
    totalDarts: 3,
  },
  167: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'T19', score: 57 },
      { segment: 'DB', score: 50 },
    ],
    totalDarts: 3,
  },
  170: {
    darts: [
      { segment: 'T20', score: 60 },
      { segment: 'T20', score: 60 },
      { segment: 'DB', score: 50 },
    ],
    totalDarts: 3,
  },
}
