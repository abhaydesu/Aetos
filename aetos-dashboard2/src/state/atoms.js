import { atom } from 'jotai';

/**
 * @description Atom to manage the currently hovered feature ID.
 * When a user hovers over a FeatureCard or an area on the InteractiveDemo,
 * this atom will hold the corresponding ID ('convergence', 'trl', 'adoption') or null.
 */
export const hoveredAtom = atom(null);