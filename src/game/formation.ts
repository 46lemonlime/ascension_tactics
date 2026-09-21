import { FormationType } from '../data/types';

export const FormationSystem = {
  getOffsets(
    squadSize: number,
    formationType: FormationType,
    spacing: number,
    livingCount?: number
  ): { x: number; z: number }[] {
    const count = Math.max(1, livingCount !== undefined ? livingCount : squadSize);
    if (count === 1) return [{ x: 0, z: 0 }];

    const offsets: { x: number; z: number }[] = [];
    if (formationType === 'line') {
      const span = (count - 1) * spacing;
      for (let i = 0; i < count; i++) {
        offsets.push({ x: -span / 2 + i * spacing, z: 0 });
      }
    } else if (formationType === 'column') {
      const span = (count - 1) * spacing;
      for (let i = 0; i < count; i++) {
        offsets.push({ x: 0, z: span / 2 - i * spacing });
      }
    } else if (formationType === 'wedge') {
      const fwd = ((count - 1) / 2) * (spacing * 0.75);
      offsets.push({ x: 0, z: fwd });
      let side = 1;
      let depth = 1;
      for (let i = 1; i < count; i++) {
        const xOff = side * depth * (spacing * 0.85);
        const zOff = fwd - depth * (spacing * 0.85);
        offsets.push({ x: xOff, z: zOff });
        if (side === -1) depth++;
        side = -side;
      }
    } else if (formationType === 'loose') {
      if (count === 2) {
        offsets.push({ x: -spacing * 0.6, z: 0 }, { x: spacing * 0.6, z: 0 });
      } else if (count === 3) {
        offsets.push(
          { x: 0, z: spacing * 0.7 },
          { x: -spacing * 0.75, z: -spacing * 0.5 },
          { x: spacing * 0.75, z: -spacing * 0.5 }
        );
      } else if (count === 4) {
        offsets.push(
          { x: -spacing * 0.7, z: spacing * 0.6 },
          { x: spacing * 0.7, z: spacing * 0.6 },
          { x: -spacing * 0.7, z: -spacing * 0.6 },
          { x: spacing * 0.7, z: -spacing * 0.6 }
        );
      } else {
        offsets.push(
          { x: 0, z: 0 },
          { x: -spacing * 0.95, z: spacing * 0.75 },
          { x: spacing * 0.95, z: spacing * 0.75 },
          { x: -spacing * 0.95, z: -spacing * 0.75 },
          { x: spacing * 0.95, z: -spacing * 0.75 }
        );
      }
    } else {
      // 'block'
      if (count === 2) {
        offsets.push({ x: -spacing * 0.5, z: 0 }, { x: spacing * 0.5, z: 0 });
      } else if (count === 3) {
        offsets.push(
          { x: 0, z: spacing * 0.6 },
          { x: -spacing * 0.6, z: -spacing * 0.6 },
          { x: spacing * 0.6, z: -spacing * 0.6 }
        );
      } else if (count === 4) {
        offsets.push(
          { x: -spacing * 0.5, z: spacing * 0.5 },
          { x: spacing * 0.5, z: spacing * 0.5 },
          { x: -spacing * 0.5, z: -spacing * 0.5 },
          { x: spacing * 0.5, z: -spacing * 0.5 }
        );
      } else {
        offsets.push(
          { x: 0, z: 0 },
          { x: -spacing * 0.8, z: spacing * 0.8 },
          { x: spacing * 0.8, z: spacing * 0.8 },
          { x: -spacing * 0.8, z: -spacing * 0.8 },
          { x: spacing * 0.8, z: -spacing * 0.8 }
        );
      }
    }
    return offsets;
  }
};
