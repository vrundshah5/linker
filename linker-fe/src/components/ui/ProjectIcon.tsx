import { Briefcase } from 'lucide-react'

interface ProjectIconProps {
  project: { iconUrl?: string; color: string; name: string }
  /** Controls outer container + inner icon size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const SIZE_MAP = {
  xs: { container: 'size-5',  icon: 'size-2.5', rounded: 'rounded' },
  sm: { container: 'size-7',  icon: 'size-3.5', rounded: 'rounded-lg' },
  md: { container: 'size-8',  icon: 'size-4',   rounded: 'rounded-lg' },
  lg: { container: 'size-12', icon: 'size-6',   rounded: 'rounded-2xl' },
  xl: { container: 'size-16', icon: 'size-8',   rounded: 'rounded-2xl' },
}

export default function ProjectIcon({ project, size = 'md', className = '' }: ProjectIconProps) {
  const { container, icon, rounded } = SIZE_MAP[size]

  if (project.iconUrl) {
    return (
      <div className={`${container} ${rounded} overflow-hidden shrink-0 ${className}`}>
        <img src={project.iconUrl} alt={project.name} className="w-full h-full object-cover" />
      </div>
    )
  }

  return (
    <div
      className={`${container} ${rounded} flex items-center justify-center shrink-0 ${className}`}
      style={{ backgroundColor: `${project.color}25` }}
    >
      <Briefcase className={icon} style={{ color: project.color }} />
    </div>
  )
}
