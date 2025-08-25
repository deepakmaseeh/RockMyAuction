'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import auctionAPI from '@/lib/auctionAPI'
import { useUserRole } from '@/contexts/RoleContext'
import {
  Chart as ChartJS,
  CategoryScale,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'

export default function Wallet() {
  const router = useRouter()
  const { user } = useUserRole()
  const [data, setData] = useState(null)
  const [txs, setTxs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('overview')

  const [showAdd, setShowAdd] = useState(false)
  const [addAmt, setAddAmt] = useState('')
  const [processingAdd, setProcessingAdd] = useState(false)

  const [showWith, setShowWith] = useState(false)
  const [withAmt, setWithAmt] = useState('')
  const [withMethod, setWithMethod] = useState('bank')
  const [processingWith, setProcessingWith] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        // Replace with real API requests
        const wallet = {
          balance: 1250.75,
          pending: 340.50,
          earnings: 5680.25,
          spent: 2340.80,
          status: 'verified'
        }
        const transactions = [
          { id:1, type:'credit', amount:450, source:'Won Vintage Watch', date:'Jan 20, 2025', status:'completed' },
          { id:2, type:'debit', amount:125, source:'Bid Art Collectible', date:'Jan 19, 2025', status:'completed' },
          { id:3, type:'credit', amount:200, source:'Top-up Credit', date:'Jan 18, 2025', status:'completed' },
          { id:4, type:'debit', amount:75.50, source:'Platform Fee', date:'Jan 17, 2025', status:'completed' },
          { id:5, type:'credit', amount:890.25, source:'Sale Electronics', date:'Jan 16, 2025', status:'pending' }
        ]
        setData(wallet)
        setTxs(transactions)
      } catch {
        setError('Unable to load wallet.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  const handleAdd = async () => {
    if (!addAmt || parseFloat(addAmt) <= 0) return alert('Enter valid amount')
    setProcessingAdd(true)
    await new Promise(r => setTimeout(r, 1500))
    setData(w => ({ ...w, balance: w.balance + parseFloat(addAmt) }))
    setTxs(t => ([{ id:Date.now(), type:'credit', amount:parseFloat(addAmt), source:'Top-up', date:new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}), status:'completed' },...t]))
    setShowAdd(false); setAddAmt(''); setProcessingAdd(false)
  }

  const handleWith = async () => {
    if (!withAmt||parseFloat(withAmt)<=0) return alert('Enter valid amount')
    if (parseFloat(withAmt)>data.balance) return alert('Insufficient')
    setProcessingWith(true)
    await new Promise(r=>setTimeout(r,1500))
    setData(w=>({ ...w, balance: w.balance - parseFloat(withAmt) }))
    setTxs(t=>([{ id:Date.now(), type:'debit', amount:parseFloat(withAmt), source:`Withdraw ${withMethod}`, date:new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}), status:'pending' },...t]))
    setShowWith(false); setWithAmt(''); setProcessingWith(false)
  }

  if (loading) return <div className="p-6 animate-pulse"><div className="h-48 bg-[#232326] rounded-xl"></div></div>
  if (error) return <div className="p-6 text-red-400 text-center">{error}</div>

    ChartJS.register(
  CategoryScale,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)
const balanceHistory = [
  { date: '2025-08-19', balance: 1200 },
  { date: '2025-08-20', balance: 1300 },
  { date: '2025-08-21', balance: 1280 },
  { date: '2025-08-22', balance: 1350 },
  { date: '2025-08-23', balance: 1400 },
  { date: '2025-08-24', balance: 1380 },
  { date: '2025-08-25', balance: 1425 },
]
// Chart data
const chartData = {
  labels: balanceHistory.map(p => p.date),
  datasets: [
    {
      label: 'Balance',
      data: balanceHistory.map(p => p.balance),
      borderColor: '#FFA500',
      backgroundColor: 'rgba(255,165,0,0.2)',
      tension: 0.3,
      pointRadius: 4
    }
  ]
}

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      ticks: { color: '#ccc' },
      grid: { display: false }
    },
    y: {
      ticks: { color: '#ccc' },
      grid: { color: '#333' }
    }
  },
  plugins: {
    legend: {
      labels: { color: '#ccc' }
    }
  }
}

  return (
    <div className="min-h-screen bg-[#09090B] text-white p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-3xl font-bold">💰 Wallet</h1>
        <div className="flex flex-wrap gap-2">
          <button onClick={()=>setShowAdd(true)} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex-1 sm:flex-none text-center">➕ Add</button>
          <button onClick={()=>setShowWith(true)} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex-1 sm:flex-none text-center">➖ Withdraw</button>
        </div>
      </div>

      {/* Balances */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon:'💵', label:'Balance', value:data.balance },
          { icon:'⏳', label:'Pending', value:data.pending },
          { icon:'💸', label:'Earnings', value:data.earnings },
          { icon:'💳', label:'Spent', value:data.spent }
        ].map((c,i)=>(
          <div key={i} className="bg-[#18181B] p-4 sm:p-6 rounded-xl flex flex-col items-center">
            <div className="text-4xl mb-2">{c.icon}</div>
            <div className="text-2xl font-bold">${c.value.toFixed(2)}</div>
            <div className="text-sm text-gray-400">{c.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-700 overflow-x-auto">
        <nav className="inline-flex space-x-6">
          <button onClick={()=>setTab('overview')} className={`pb-2 ${tab==='overview'?'border-b-2 border-orange-400 text-orange-400':'text-gray-400 hover:text-white'}`}>Overview</button>
          <button onClick={()=>setTab('transactions')} className={`pb-2 ${tab==='transactions'?'border-b-2 border-orange-400 text-orange-400':'text-gray-400 hover:text-white'}`}>Transactions</button>
        </nav>
      </div>

      {/* Content */}
      {tab==='overview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#18181B] p-4 sm:p-6 rounded-xl">
            <h2 className="font-semibold mb-4">Balance Trend</h2>
            <div className="h-64 sm:h-80">
  <Line data={chartData} options={chartOptions} />
</div>
          </div>
          <div className="space-y-4">
            {[
              { label:'Added This Month', value:1250 },
              { label:'Withdrawn This Month', value:340 },
              { label:'Avg Txn Value', value:185 }
            ].map((s,i)=>(
              <div key={i} className="bg-[#18181B] p-4 sm:p-6 rounded-xl flex justify-between">
                <span className="text-gray-400">{s.label}</span>
                <span className="font-semibold">${s.value}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {txs.map(tx=>(
            <div key={tx.id} className="bg-[#18181B] p-4 sm:p-6 rounded-xl flex justify-between items-center">
              <div>
                <div className="font-medium truncate max-w-xs">{tx.source}</div>
                <div className="text-xs text-gray-400">{tx.date} • {tx.status}</div>
              </div>
              <div className={`text-lg font-semibold ${tx.type==='credit'?'text-green-400':'text-red-400'}`}>
                {tx.type==='credit'?'+':'-'}${tx.amount.toFixed(2)}
              </div>
            </div>
          ))}
          {txs.length===0 && <p className="text-center text-gray-400">No transactions yet.</p>}
        </div>
      )}

      {/* Modals */}
      {showAdd && (
        <Modal title="➕ Add Money" onClose={()=>setShowAdd(false)}>
          <input type="number" placeholder="Amount USD" value={addAmt} onChange={e=>setAddAmt(e.target.value)}
            className="w-full bg-[#232326] p-3 rounded-lg mb-4" />
          <button disabled={processingAdd} onClick={handleAdd}
            className="w-full bg-green-600 hover:bg-green-700 p-3 rounded-lg mb-2 text-center">
            {processingAdd?'Processing...':'Confirm'}
          </button>
          <button onClick={()=>setShowAdd(false)} className="w-full bg-gray-600 hover:bg-gray-700 p-3 rounded-lg text-center">Cancel</button>
        </Modal>
      )}
      {showWith && (
        <Modal title="➖ Withdraw Money" onClose={()=>setShowWith(false)}>
          <input type="number" placeholder="Amount USD" value={withAmt} onChange={e=>setWithAmt(e.target.value)}
            className="w-full bg-[#232326] p-3 rounded-lg mb-4" />
          <select value={withMethod} onChange={e=>setWithMethod(e.target.value)}
            className="w-full bg-[#232326] p-3 rounded-lg mb-4">
            <option value="bank">🏦 Bank Account</option>
            <option value="paypal">💻 PayPal</option>
          </select>
          <button disabled={processingWith} onClick={handleWith}
            className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg mb-2 text-center">
            {processingWith?'Processing...':'Confirm'}
          </button>
          <button onClick={()=>setShowWith(false)} className="w-full bg-gray-600 hover:bg-gray-700 p-3 rounded-lg text-center">Cancel</button>
        </Modal>
      )}
    </div>
  )
}

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
    <div className="bg-[#18181B] rounded-xl p-6 w-full max-w-xs">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
      </div>
      {children}
    </div>
  </div>
)
