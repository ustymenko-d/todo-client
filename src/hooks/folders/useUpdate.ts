import useAppStore from '@/store/store'
import { IFolder, IFolderWithTasks } from '@/types/folders'

type TAction = 'create' | 'rename' | 'delete'

type THandlerProps = (
	folders: IFolderWithTasks[],
	folder: IFolder
) => IFolderWithTasks[]

const useUpdate = () => {
	const foldersWithTasks = useAppStore((state) => state.foldersWithTasks)
	const setFoldersWithTasks = useAppStore((state) => state.setFoldersWithTasks)

	const handlers: Record<TAction, THandlerProps> = {
		create: handleCreate,
		rename: handleRename,
		delete: handleDelete,
	}

	const handleUpdateFolders = (action: TAction, updatedFolder: IFolder) => {
		const handler = handlers[action]

		if (isHydrated(action, updatedFolder, foldersWithTasks)) return

		setFoldersWithTasks((prev) => handler(prev, updatedFolder))
	}

	return { handleUpdateFolders }
}

const isHydrated = (
	action: TAction,
	folder: IFolder,
	folders: IFolderWithTasks[]
): boolean => {
	const existing = folders.find((f) => f.id === folder.id)

	return (
		{
			create: !!existing,
			rename: existing?.name === folder.name,
			delete: !existing,
		}[action] ?? false
	)
}

const handleCreate: THandlerProps = (folders, newFolder) =>
	folders.some((folder) => folder.id === newFolder.id)
		? folders
		: [newFolder, ...folders]

const handleRename: THandlerProps = (folders, renamedFolder) =>
	folders.map((folder) =>
		folder.id === renamedFolder.id && folder.name !== renamedFolder.name
			? { ...folder, name: renamedFolder.name }
			: folder
	)

const handleDelete: THandlerProps = (folders, deletedFolder) =>
	folders.filter((folder) => folder.id !== deletedFolder.id)

export default useUpdate
