import {
  Palette,
  Code2,
  TrendingUp,
  Lightbulb,
  BookOpen,
  Coffee,
  DollarSign,
  Map,
  Folder,
  Star,
  Heart,
  Globe,
  Music,
  Camera,
  Briefcase,
  ShoppingCart,
  Film,
  type LucideIcon,
} from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  Palette,
  Code2,
  TrendingUp,
  Lightbulb,
  BookOpen,
  Coffee,
  DollarSign,
  Map,
  Folder,
  Star,
  Heart,
  Globe,
  Music,
  Camera,
  Briefcase,
  ShoppingCart,
  Film,
}

export function getCategoryIcon(iconName: string): LucideIcon {
  return ICON_MAP[iconName] ?? Folder
}
