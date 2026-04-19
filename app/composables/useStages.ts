export const stageOrder = [
	'agreement',
	'earnest_money',
	'title_deed',
	'completed'
] as const

export type TransactionStage = typeof stageOrder[number]

export const stageLabels: Record<TransactionStage, string> = {
	agreement: 'Anlasma',
	earnest_money: 'Kapora',
	title_deed: 'Tapu',
	completed: 'Tamamlandi'
}

export const useStages = () => stageOrder

export const getNextStage = (stage: TransactionStage) => {
	const currentIndex = stageOrder.indexOf(stage)

	if (currentIndex === -1 || currentIndex === stageOrder.length - 1) {
		return null
	}

	return stageOrder[currentIndex + 1]
}
