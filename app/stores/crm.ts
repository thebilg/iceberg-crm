import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { TransactionStage } from '~/composables/useStages'
import { getNextStage } from '~/composables/useStages'

type ApiClient = ReturnType<typeof useApi>

export interface AgentRecord {
  _id: string
  name: string
  email: string
  phone: string
  totalEarnings: number
}

export interface PropertyRecord {
  _id: string
  title: string
  price: number
  city: string
  status: 'available' | 'in_transaction' | 'sold'
  listedBy: AgentRecord | null
}

export interface CommissionBreakdown {
  total: number
  agency: number
  listingAgent: number
  sellingAgent: number
}

export interface TransactionRecord {
  _id: string
  propertyId: PropertyRecord | null
  listingAgentId: AgentRecord | null
  sellingAgentId: AgentRecord | null
  price: number
  stage: TransactionStage
  commission: CommissionBreakdown | null
}

interface CreateAgentPayload {
  name: string
  email: string
  phone: string
}

interface CreatePropertyPayload {
  title: string
  city: string
  price: number
  listedBy: string
}

interface CreateTransactionPayload {
  propertyId: string
  listingAgentId: string
  sellingAgentId: string
  price: number
}

const buildId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`

const resolveTransactionAmount = (property: PropertyRecord | null, fallbackPrice: number) => Number(property?.price || fallbackPrice || 0)

const normalizeAgent = (agent: Partial<AgentRecord> & { _id?: string }): AgentRecord => ({
  _id: String(agent._id || buildId('agent')),
  name: String(agent.name || 'Adsız danışman'),
  email: String(agent.email || '-'),
  phone: String(agent.phone || '-'),
  totalEarnings: Number(agent.totalEarnings || 0)
})

const calculateCommission = (price: number, listingAgentId?: string | null, sellingAgentId?: string | null): CommissionBreakdown | null => {
  if (!listingAgentId || !sellingAgentId) {
    return null
  }

  const total = price * 0.05
  const agency = total * 0.5

  if (listingAgentId === sellingAgentId) {
    return {
      total,
      agency,
      listingAgent: total * 0.5,
      sellingAgent: 0
    }
  }

  return {
    total,
    agency,
    listingAgent: total * 0.25,
    sellingAgent: total * 0.25
  }
}

const resolveApiErrorMessage = (error: any, fallback: string) => {
  const apiMessage = error?.data?.message

  if (Array.isArray(apiMessage) && apiMessage.length) {
    return apiMessage.join(' ')
  }

  if (typeof apiMessage === 'string' && apiMessage.trim()) {
    return apiMessage
  }

  if (typeof error?.message === 'string' && error.message.trim()) {
    return error.message
  }

  return fallback
}

export const useCrmStore = defineStore('crm', () => {
  const agents = ref<AgentRecord[]>([])
  const properties = ref<PropertyRecord[]>([])
  const transactions = ref<TransactionRecord[]>([])
  const loaded = ref(false)
  const pending = ref(false)
  const notice = ref('')

  const findAgent = (id: string) => agents.value.find(agent => agent._id === id) || null
  const findProperty = (id: string) => properties.value.find(property => property._id === id) || null

  const syncPropertyStatus = (propertyId: string) => {
    const property = findProperty(propertyId)

    if (!property) {
      return
    }

    const relatedTransactions = transactions.value.filter(transaction => transaction.propertyId?._id === propertyId)

    if (relatedTransactions.some(transaction => transaction.stage === 'completed')) {
      property.status = 'sold'
      return
    }

    property.status = relatedTransactions.length ? 'in_transaction' : 'available'
  }

  const applyAgentEarnings = (
    commission: CommissionBreakdown | null,
    listingAgent: AgentRecord | null,
    sellingAgent: AgentRecord | null,
    factor: 1 | -1
  ) => {
    if (!commission) {
      return
    }

    if (listingAgent) {
      listingAgent.totalEarnings += commission.listingAgent * factor
    }

    if (sellingAgent && sellingAgent._id !== listingAgent?._id) {
      sellingAgent.totalEarnings += commission.sellingAgent * factor
    }
  }

  const normalizeProperty = (property: any): PropertyRecord => {
    const listedBySource = property?.listedBy
    const listedById = typeof listedBySource === 'string' ? listedBySource : listedBySource?._id
    const listedBy = listedById
      ? findAgent(String(listedById)) || (listedBySource && typeof listedBySource === 'object' ? normalizeAgent(listedBySource) : null)
      : (listedBySource && typeof listedBySource === 'object' ? normalizeAgent(listedBySource) : null)

    return {
      _id: String(property?._id || buildId('property')),
      title: String(property?.title || 'Adsız ilan'),
      price: Number(property?.price || 0),
      city: String(property?.city || '-'),
      status: (property?.status || 'available') as PropertyRecord['status'],
      listedBy
    }
  }

  const normalizeTransaction = (transaction: any): TransactionRecord => {
    const propertyId = typeof transaction?.propertyId === 'string' ? transaction.propertyId : transaction?.propertyId?._id
    const listingAgentId = typeof transaction?.listingAgentId === 'string' ? transaction.listingAgentId : transaction?.listingAgentId?._id
    const sellingAgentId = typeof transaction?.sellingAgentId === 'string' ? transaction.sellingAgentId : transaction?.sellingAgentId?._id
    const property = propertyId ? findProperty(String(propertyId)) : null
    const listingAgentSource = transaction?.listingAgentId
    const sellingAgentSource = transaction?.sellingAgentId
    const listingAgent = listingAgentId
      ? findAgent(String(listingAgentId)) || (listingAgentSource && typeof listingAgentSource === 'object' ? normalizeAgent(listingAgentSource) : null)
      : null
    const sellingAgent = sellingAgentId
      ? findAgent(String(sellingAgentId)) || (sellingAgentSource && typeof sellingAgentSource === 'object' ? normalizeAgent(sellingAgentSource) : null)
      : null
    const price = resolveTransactionAmount(property, Number(transaction?.price || 0))

    return {
      _id: String(transaction?._id || buildId('transaction')),
      propertyId: property,
      listingAgentId: listingAgent,
      sellingAgentId: sellingAgent,
      price,
      stage: (transaction?.stage || 'agreement') as TransactionStage,
      commission: calculateCommission(price, listingAgent?._id, sellingAgent?._id)
    }
  }

  const load = async (api: ApiClient) => {
    if (loaded.value || pending.value) {
      return
    }

    pending.value = true

    try {
      const [agentItems, propertyItems, transactionItems] = await Promise.all([
        api.get<any[]>('/agents'),
        api.get<any[]>('/properties'),
        api.get<any[]>('/transactions')
      ])

      agents.value = agentItems.map(agent => normalizeAgent(agent))
      properties.value = propertyItems.map(property => normalizeProperty(property))
      transactions.value = transactionItems.map(transaction => normalizeTransaction(transaction))
      notice.value = ''
      loaded.value = true
    } catch {
      agents.value = []
      properties.value = []
      transactions.value = []
      notice.value = 'API ulaşılamadı. Veriler yüklenemedi.'
      loaded.value = true
    } finally {
      pending.value = false
    }
  }

  const createAgent = async (api: ApiClient, payload: CreateAgentPayload) => {
    try {
      const created = await api.post<any>('/agents', payload)
      agents.value.unshift(normalizeAgent(created))
      notice.value = ''
      return
    } catch (error) {
      notice.value = resolveApiErrorMessage(error, 'Danışman oluşturulamadı. Backend kayıt işlemini tamamlamadı.')
      return
    }
  }

  const createProperty = async (api: ApiClient, payload: CreatePropertyPayload) => {
    try {
      const created = await api.post<any>('/properties', payload)
      properties.value.unshift(normalizeProperty(created))
      notice.value = ''
      return
    } catch (error) {
      notice.value = resolveApiErrorMessage(error, 'Ev oluşturulamadı. Backend kayıt işlemini tamamlamadı.')
      return
    }
  }

  const createTransaction = async (api: ApiClient, payload: CreateTransactionPayload) => {
    const property = findProperty(payload.propertyId)
    const price = resolveTransactionAmount(property, payload.price)

    try {
      const created = await api.post<any>('/transactions', {
        ...payload,
        price
      })
      transactions.value.unshift(normalizeTransaction(created))
      notice.value = ''
      if (property) {
        syncPropertyStatus(property._id)
      }
      return
    } catch (error) {
      notice.value = resolveApiErrorMessage(error, 'Satış oluşturulamadı. Backend kayıt işlemini tamamlamadı.')
      return
    }
  }

  const deleteProperty = async (api: ApiClient, id: string) => {
    const index = properties.value.findIndex(property => property._id === id)

    if (index === -1) {
      return
    }

    try {
      await api.delete(`/properties/${id}`)
      notice.value = ''
    } catch (error) {
      notice.value = resolveApiErrorMessage(error, 'Ev silinemedi. Backend silme isteğini tamamlamadı.')
      return
    }

    properties.value.splice(index, 1)
    transactions.value = transactions.value.filter(transaction => transaction.propertyId?._id !== id)
  }

  const deleteAgent = async (api: ApiClient, id: string) => {
    const index = agents.value.findIndex(agent => agent._id === id)

    if (index === -1) {
      return
    }

    try {
      await api.delete(`/agents/${id}`)
      notice.value = ''
    } catch (error) {
      notice.value = resolveApiErrorMessage(error, 'Danışman silinemedi. Backend silme isteğini tamamlamadı.')
      return
    }

    agents.value.splice(index, 1)

    properties.value = properties.value.map(property => {
      if (property.listedBy?._id !== id) {
        return property
      }

      return {
        ...property,
        listedBy: null
      }
    })

    transactions.value = transactions.value.map(transaction => ({
      ...transaction,
      listingAgentId: transaction.listingAgentId?._id === id ? null : transaction.listingAgentId,
      sellingAgentId: transaction.sellingAgentId?._id === id ? null : transaction.sellingAgentId
    }))
  }

  const deleteTransaction = async (api: ApiClient, id: string) => {
    const transaction = transactions.value.find(item => item._id === id)

    if (!transaction) {
      return
    }

    try {
      await api.delete(`/transactions/${id}`)
      notice.value = ''
    } catch (error) {
      notice.value = resolveApiErrorMessage(error, 'Satış silinemedi. Backend silme isteğini tamamlamadı.')
      return
    }

    if (transaction.stage === 'completed') {
      applyAgentEarnings(transaction.commission, transaction.listingAgentId, transaction.sellingAgentId, -1)
    }

    transactions.value = transactions.value.filter(item => item._id !== id)

    if (transaction.propertyId) {
      syncPropertyStatus(transaction.propertyId._id)
    }
  }

  const setTransactionStage = async (api: ApiClient, id: string, stage: TransactionStage) => {
    const transaction = transactions.value.find(item => item._id === id)

    if (!transaction || transaction.stage === stage) {
      return
    }

    if (stage === 'completed' && (!transaction.listingAgentId || !transaction.sellingAgentId)) {
      notice.value = 'İşlem tamamlanamıyor. Tamamlandı adımı için listeleyen ve satan danışman kayıtları eksiksiz olmalı.'
      return
    }

    const previousStage = transaction.stage
    const previousCommission = transaction.commission
    const previousListingAgent = transaction.listingAgentId
    const previousSellingAgent = transaction.sellingAgentId

    try {
      const updated = await api.patch<any>(`/transactions/${id}/stage`, { stage })
      Object.assign(transaction, normalizeTransaction({ ...transaction, ...updated, stage }))
      notice.value = ''
    } catch (error) {
      notice.value = resolveApiErrorMessage(
        error,
        stage === 'completed'
        ? 'İşlem tamamlanamadı. Tamamlandı adımında komisyon hesaplaması yapıldığı için satıştaki danışman kayıtları backend tarafında geçerli olmalı.'
        : 'İşlem yapılamadı. Satışları yalnızca tek tek, bir sonraki aşamaya ilerletebilirsin.'
      )
      return
    }

    if (previousStage !== 'completed' && transaction.stage === 'completed') {
      applyAgentEarnings(transaction.commission, transaction.listingAgentId, transaction.sellingAgentId, 1)
    }

    if (previousStage === 'completed' && transaction.stage !== 'completed') {
      applyAgentEarnings(previousCommission, previousListingAgent, previousSellingAgent, -1)
    }

    if (transaction.propertyId) {
      syncPropertyStatus(transaction.propertyId._id)
    }
  }

  const advanceTransaction = async (api: ApiClient, id: string) => {
    const transaction = transactions.value.find(item => item._id === id)

    if (!transaction) {
      return
    }

    const nextStage = getNextStage(transaction.stage)

    if (!nextStage) {
      return
    }

    await setTransactionStage(api, id, nextStage)
  }

  return {
    agents,
    properties,
    transactions,
    loaded: computed(() => loaded.value),
    pending: computed(() => pending.value),
    notice,
    load,
    createAgent,
    createProperty,
    createTransaction,
    deleteAgent,
    deleteProperty,
    deleteTransaction,
    setTransactionStage,
    advanceTransaction
  }
})