// src/components/RoleDashboard.js
import { useUserRole } from '../hooks/useUserRole'
import BuyerDashboard from './BuyerDashboard'
import SellerDashboard from './SellerDashboard'

export default function RoleDashboard() {
  const { isBuyer, isSeller } = useUserRole()

  return (
    <div className="min-h-screen bg-[#09090B]">
      {isBuyer && <BuyerDashboard />}
      {isSeller && <SellerDashboard />}
    </div>
  )
}
