import { DraggableAttributes } from '@dnd-kit/core'
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'
import { GripVertical } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface IDragProps {
	attributes: DraggableAttributes
	listeners: SyntheticListenerMap | undefined
	setNodeRef: (node: HTMLElement | null) => void
	isDragging: boolean
}

interface Props {
	id: string
	dragProps?: IDragProps
	taskInMotion?: string | null
}

const DragHandle = ({ id, dragProps, taskInMotion }: Props) => (
	<div
		{...dragProps?.listeners}
		onClick={e => e.stopPropagation()}
		className={cn(
			'flex items-center justify-center px-2 text-muted-foreground border-r',
			taskInMotion === id ? 'cursor-grabbing' : 'cursor-grab'
		)}>
		<GripVertical size={18} />
	</div>
)

export default DragHandle
