import {
  Zap,
  Droplets,
  Bike,
  Carrot,
  ShoppingBag,
  Recycle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { CategoryId } from '@/lib/questions';

export const CATEGORY_ICONS: Record<CategoryId, LucideIcon> = {
  energia: Zap,
  agua: Droplets,
  transporte: Bike,
  alimentacao: Carrot,
  compras: ShoppingBag,
  residuos: Recycle,
};
