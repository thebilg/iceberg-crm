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

const normalizeAgent = (agent: Partial<AgentRecord> & { _id?: string }): AgentRecord => ({
  _id: String(agent._id || buildId('agent')),
  name: String(agent.name || 'Adsız danışman'),
  email: String(agent.email || '-'),
  phone: String(agent.phone || '-'),
  totalEarnings: Number(agent.totalEarnings || 0)
})

const calculateCommission = (price: number, listingAgentId: string, sellingAgentId: string): CommissionBreakdown => {
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

export const useCrmStore = defineStore('crm', () => {
  const agents = ref<AgentRecord[]>([])
  const properties = ref<PropertyRecord[]>([])
  const transactions = ref<TransactionRecord[]>([])
  const loaded = ref(false)
  const pending = ref(false)
  const notice = ref('')

  const findAgent = (id: string) => agents.value.find(agent => agent._id === id) || null
  const findProperty = (id: string) => properties.value.find(property => property._id === id) || null

  const normalizeProperty = (property: any): PropertyRecord => {
    const listedBySource = property?.listedBy
    const listedById = typeof listedBySource === 'string' ? listedBySource : listedBySource?._id

    return {
      _id: String(property?._id || buildId('property')),
      title: String(property?.title || 'Adsız ilan'),
      price: Number(property?.price || 0),
      city: String(property?.city || '-'),
      status: (property?.status || 'available') as PropertyRecord['status'],
      listedBy: listedById ? findAgent(String(listedById)) : null
    }
  }

  const normalizeTransaction = (transaction: any): TransactionRecord => {
    const propertyId = typeof transaction?.propertyId === 'string' ? transaction.propertyId : transaction?.propertyId?._id
    const listingAgentId = typeof transaction?.listingAgentId === 'string' ? transaction.listingAgentId : transaction?.listingAgentId?._id
    const sellingAgentId = typeof transaction?.sellingAgentId === 'string' ? transaction.sellingAgentId : transaction?.sellingAgentId?._id

    return {
      _id: String(transaction?._id || buildId('transaction')),
      propertyId: propertyId ? findProperty(String(propertyId)) : null,
      listingAgentId: listingAgentId ? findAgent(String(listingAgentId)) : null,
      sellingAgentId: sellingAgentId ? findAgent(String(sellingAgentId)) : null,
      price: Number(transaction?.price || 0),
      stage: (transaction?.stage || 'agreement') as TransactionStage,
      commission: transaction?.commission || null
    }
  }

  const seedDemoData = () => {
    const aylin = normalizeAgent({ _id: 'agent-1', name: 'Aylin Demir', email: 'aylin@iceberg.com', phone: '+90 555 101 10 10', totalEarnings: 9200 })
    const mert = normalizeAgent({ _id: 'agent-2', name: 'Mert Kaya', email: 'mert@iceberg.com', phone: '+90 555 202 20 20', totalEarnings: 6600 })
    const selin = normalizeAgent({ _id: 'agent-3', name: 'Selin Aras', email: 'selin@iceberg.com', phone: '+90 555 303 30 30', totalEarnings: 12400 })

    agents.value = [aylin, mert, selin]
    properties.value = [
      { _id: 'property-1', title: 'Suadiye Panoramik Dubleks', city: 'İstanbul', price: 875000, status: 'available', listedBy: aylin },
      { _id: 'property-2', title: 'Çeşme Bahçe Villası', city: 'İzmir', price: 1290000, status: 'in_transaction', listedBy: mert },
      { _id: 'property-3', title: 'Bodrum Marina Loft', city: 'Muğla', price: 940000, status: 'sold', listedBy: selin }
    ]

    transactions.value = [
      {
        _id: 'transaction-1',
        propertyId: properties.value[1] || null,
        listingAgentId: mert,
        sellingAgentId: aylin,
        price: 1290000,
        stage: 'earnest_money',
        commission: calculateCommission(1290000, mert._id, aylin._id)
      },
      {
        _id: 'transaction-2',
        propertyId: properties.value[2] || null,
        listingAgentId: selin,
        sellingAgentId: selin,
        price: 940000,
        stage: 'completed',
        commission: calculateCommission(940000, selin._id, selin._id)
      }
    ]

    notice.value = 'API ulaşılamadı, arayüz demo verisi ile çalışıyor.'
    loaded.value = true
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
      seedDemoData()
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
    } catch {
      notice.value = 'API yazma işlemi başarısız oldu, kayıt yerel olarak eklendi.'
    }

    agents.value.unshift(normalizeAgent(payload))
  }

  const createProperty = async (api: ApiClient, payload: CreatePropertyPayload) => {
    try {
      const created = await api.post<any>('/properties', payload)
      properties.value.unshift(normalizeProperty(created))
      notice.value = ''
      return
    } catch {
      notice.value = 'API yazma işlemi başarısız oldu, kayıt yerel olarak eklendi.'
    }

    properties.value.unshift({
      _id: buildId('property'),
      title: payload.title,
      city: payload.city,
      price: payload.price,
      status: 'available',
      listedBy: findAgent(payload.listedBy)
    })
  }

  const createTransaction = async (api: ApiClient, payload: CreateTransactionPayload) => {
    try {
      const created = await api.post<any>('/transactions', payload)
      transactions.value.unshift(normalizeTransaction(created))
      notice.value = ''
      return
    } catch {
      notice.value = 'API yazma işlemi başarısız oldu, kayıt yerel olarak eklendi.'
    }

    const property = findProperty(payload.propertyId)

    transactions.value.unshift({
      _id: buildId('transaction'),
      propertyId: property,
      listingAgentId: findAgent(payload.listingAgentId),
      sellingAgentId: findAgent(payload.sellingAgentId),
      price: payload.price,
      stage: 'agreement',
      commission: calculateCommission(payload.price, payload.listingAgentId, payload.sellingAgentId)
    })

    if (property) {
      property.status = 'in_transaction'
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

    try {
      const updated = await api.patch<any>(`/transactions/${id}/stage`, { stage: nextStage })
      Object.assign(transaction, normalizeTransaction(updated))
      notice.value = ''
      return
    } catch {
      notice.value = 'Aşama güncellemesi API tarafında başarısız oldu, arayüz yerel olarak ilerletildi.'
    }

    transaction.stage = nextStage

    if (transaction.propertyId) {
      transaction.propertyId.status = nextStage === 'completed' ? 'sold' : 'in_transaction'
    }

    if (nextStage === 'completed' && transaction.commission) {
      if (transaction.listingAgentId) {
        transaction.listingAgentId.totalEarnings += transaction.commission.listingAgent
      }

      if (transaction.sellingAgentId && transaction.sellingAgentId._id !== transaction.listingAgentId?._id) {
        transaction.sellingAgentId.totalEarnings += transaction.commission.sellingAgent
      }
    }
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
    advanceTransaction
  }
})