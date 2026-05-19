import React from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import ChartCard from "@/components/dashboard/ChartCard";

export default function RewardChart({ data }) {
  const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6'];

  return (
    <ChartCard 
      title="Points Distribution" 
      description="Top customers by reward points"
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ left: 40, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
          <XAxis type="number" hide />
          <YAxis 
            type="category" 
            dataKey="name" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            width={100}
          />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
          />
          <Bar dataKey="points" radius={[0, 4, 4, 0]} barSize={20}>
            {data?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
