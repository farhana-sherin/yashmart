import React from "react";
import { Mail, Phone, MapPin, Calendar, Gift, DollarSign } from "lucide-react";
import Badge from "@/components/ui/Badge";

export default function CustomerDetailsCard({ customer }) {
  return (
    <div className="bg-card p-6 rounded-xl border shadow-sm space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold border">
          {customer.full_name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{customer.full_name}</h2>
          <Badge variant="outline" className="mt-1">CUSTOMER ID: {customer.id}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-2 text-sm">
          <Mail className="w-4 h-4 text-muted-foreground" />
          <span>{customer.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Phone className="w-4 h-4 text-muted-foreground" />
          <span>{customer.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span>{customer.address || "No address provided"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span>Joined: {new Date(customer.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="pt-6 border-t grid grid-cols-2 gap-6 text-center">
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2 text-emerald-500">
            <Gift size={20} />
            <span className="text-2xl font-bold">{customer.total_points || 0}</span>
          </div>
          <p className="text-xs text-muted-foreground uppercase font-semibold">Reward Points</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2 text-amber-500">
            <DollarSign size={20} />
            <span className="text-2xl font-bold">${customer.pending_balance || 0}</span>
          </div>
          <p className="text-xs text-muted-foreground uppercase font-semibold">Pending Balance</p>
        </div>
      </div>
    </div>
  );
}
