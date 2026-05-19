import React, { useState } from "react";
import { 
  Settings, 
  Building2, 
  Coins, 
  MapPin, 
  Bell, 
  Smartphone,
  ShieldCheck,
  Save
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { settingsService } from "@/services/settings.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PageLoader from "@/components/loaders/PageLoader";
import { Spinner } from "@/components/loaders/Spinner";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("general");

  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: settingsService.getSettings,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: settingsService.updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries(["settings"]);
      toast.success("Settings updated successfully");
    },
    onError: () => toast.error("Failed to update settings"),
  });

  if (settingsLoading) return <PageLoader />;

  const tabs = [
    { id: "general", label: "General", icon: Building2 },
    { id: "loyalty", label: "Loyalty & Points", icon: Coins },
    { id: "attendance", label: "Attendance Config", icon: MapPin },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground mt-1">Configure global application parameters and business rules.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  activeTab === tab.id 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:bg-secondary"
                )}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-lg font-bold">{tabs.find(t => t.id === activeTab)?.label} Settings</h3>
            </div>

            <div className="p-6">
              {activeTab === "general" && (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    updateSettingsMutation.mutate(Object.fromEntries(formData));
                  }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company_name">Company Name</Label>
                      <Input id="company_name" name="company_name" defaultValue={settings?.data?.company_name} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company_email">Support Email</Label>
                      <Input id="company_email" name="company_email" type="email" defaultValue={settings?.data?.company_email} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company_address">Headquarters Address</Label>
                    <Input id="company_address" name="company_address" defaultValue={settings?.data?.company_address} />
                  </div>
                  <Button type="submit" disabled={updateSettingsMutation.isPending}>
                    {updateSettingsMutation.isPending ? <Spinner className="mr-2" /> : <Save className="mr-2 w-4 h-4" />}
                    Save Company Details
                  </Button>
                </form>
              )}

              {activeTab === "loyalty" && (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    updateSettingsMutation.mutate(Object.fromEntries(formData));
                  }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="point_conversion_rate">Point Conversion Value ($ per 1 Point)</Label>
                      <Input id="point_conversion_rate" name="point_conversion_rate" type="number" step="0.01" defaultValue={settings?.data?.point_conversion_rate} />
                      <p className="text-xs text-muted-foreground italic">Sets the monetary value of a single reward point.</p>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                      <div>
                        <Label>Reward System Enabled</Label>
                        <p className="text-xs text-muted-foreground">Toggle global rewards functionality.</p>
                      </div>
                      <input 
                        type="checkbox" 
                        name="reward_enabled" 
                        defaultChecked={settings?.data?.reward_enabled} 
                        className="w-5 h-5 accent-primary"
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={updateSettingsMutation.isPending}>
                    {updateSettingsMutation.isPending ? <Spinner className="mr-2" /> : <Save className="mr-2 w-4 h-4" />}
                    Update Loyalty Rules
                  </Button>
                </form>
              )}

              {activeTab === "attendance" && (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    updateSettingsMutation.mutate(Object.fromEntries(formData));
                  }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="office_latitude">Office Latitude</Label>
                        <Input id="office_latitude" name="office_latitude" type="number" step="0.000001" defaultValue={settings?.data?.office_latitude} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="office_longitude">Office Longitude</Label>
                        <Input id="office_longitude" name="office_longitude" type="number" step="0.000001" defaultValue={settings?.data?.office_longitude} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="attendance_radius">Valid Geofence Radius (Meters)</Label>
                      <Input id="attendance_radius" name="attendance_radius" type="number" defaultValue={settings?.data?.attendance_radius} />
                      <p className="text-xs text-muted-foreground">Radius within which staff must be located to check-in.</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="qr_expiry_minutes">QR Code Expiry Time (Minutes)</Label>
                      <Input id="qr_expiry_minutes" name="qr_expiry_minutes" type="number" defaultValue={settings?.data?.qr_expiry_minutes} />
                    </div>
                  </div>
                  <Button type="submit" disabled={updateSettingsMutation.isPending}>
                    {updateSettingsMutation.isPending ? <Spinner className="mr-2" /> : <Save className="mr-2 w-4 h-4" />}
                    Update Attendance Policy
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
