import { GridLayout } from '@/types';

export const gridLayouts: GridLayout[] = [
  {
    id: '1x2',
    name: 'Side by Side',
    cols: 2,
    rows: 1,
    aspectRatio: '16:9',
    slots: [
      { owner: 'self', row: 0, col: 0 },
      { owner: 'partner', row: 0, col: 1 },
    ],
  },
  {
    id: '2x1',
    name: 'Stacked',
    cols: 1,
    rows: 2,
    aspectRatio: '9:16',
    slots: [
      { owner: 'self', row: 0, col: 0 },
      { owner: 'partner', row: 1, col: 0 },
    ],
  },
  {
    id: '2x2',
    name: 'Classic Strip',
    cols: 2,
    rows: 2,
    aspectRatio: '1:1',
    slots: [
      { owner: 'self', row: 0, col: 0 },
      { owner: 'partner', row: 0, col: 1 },
      { owner: 'partner', row: 1, col: 0 },
      { owner: 'self', row: 1, col: 1 },
    ],
  },
  {
    id: '3x2',
    name: 'Collage',
    cols: 2,
    rows: 3,
    aspectRatio: '2:3',
    slots: [
      { owner: 'self', row: 0, col: 0 },
      { owner: 'partner', row: 0, col: 1 },
      { owner: 'partner', row: 1, col: 0 },
      { owner: 'self', row: 1, col: 1 },
      { owner: 'self', row: 2, col: 0 },
      { owner: 'partner', row: 2, col: 1 },
    ],
  },
  {
    id: '1x4',
    name: 'Photo Booth',
    cols: 1,
    rows: 4,
    aspectRatio: '1:3',
    slots: [
      { owner: 'self', row: 0, col: 0 },
      { owner: 'partner', row: 1, col: 0 },
      { owner: 'self', row: 2, col: 0 },
      { owner: 'partner', row: 3, col: 0 },
    ],
  },
];
