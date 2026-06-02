import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Tag, MoreVertical, Edit, Trash2, Calendar } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { offerService } from "@/services/offer.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Badge from "@/components/ui/Badge";
import PageLoader from "@/components/loaders/PageLoader";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import EmptyState from "@/components/common/EmptyState";
import { useAuthStore } from "@/store/auth.store";

export default function OfferList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  
  const { user } = useAuthStore();
  const isManager = user?.role === "ADMIN" || user?.role === "STAFF";

  const { data: offers, isLoading } = useQuery({
    queryKey: ["offers", searchTerm],
    queryFn: () => offerService.getOffers({ search: searchTerm }),
  });

  const deleteMutation = useMutation({
    mutationFn: offerService.deleteOffer,
    onSuccess: () => {
      queryClient.invalidateQueries(["offers"]);
      toast.success("Offer deleted successfully");
      setDeleteId(null);
    },
    onError: () => toast.error("Failed to delete offer"),
  });

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Promotions & Offers</h1>
          <p className="text-muted-foreground mt-1">Manage store-wide discounts and promotional banners.</p>
        </div>
        {isManager && (
          <Button onClick={() => navigate("/offers/create")} className="gap-2">
            <Plus size={18} /> New Offer
          </Button>
        )}
      </div>

      <div className="bg-card p-6 rounded-xl border shadow-sm space-y-6">
        <div className="flex items-center relative max-w-sm">
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search offers..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {offers?.data?.results?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.data.results.map((offer) => (
              <div key={offer.id} className="group bg-muted/20 border rounded-xl overflow-hidden hover:border-primary transition-all flex flex-col">
                <div className="aspect-video relative overflow-hidden bg-muted">
                  {offer.banner ? (
                    <img src={offer.banner} alt={offer.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Tag size={40} />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Badge variant={new Date(offer.end_date) > new Date() ? "success" : "destructive"}>
                      {new Date(offer.end_date) > new Date() ? "Active" : "Expired"}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg line-clamp-1">{offer.title}</h3>
                    {offer.discount_percentage ? (
                      <Badge variant="secondary" className="bg-primary/10 text-primary">-{offer.discount_percentage}%</Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-primary/10 text-primary">Promo</Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2">{offer.description}</p>
                  
                  <div className="pt-4 mt-auto border-t flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar size={14} />
                      <span>{new Date(offer.start_date).toLocaleDateString()} - {new Date(offer.end_date).toLocaleDateString()}</span>
                    </div>
                    
                    {isManager && (
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/offers/${offer.id}/edit`)}>
                          <Edit size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => setDeleteId(offer.id)}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState 
            title="No offers found" 
            description="Start by creating a new promotional offer for your customers."
            icon={Tag}
            action={<Button onClick={() => navigate("/offers/create")}>Add First Offer</Button>}
          />
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteMutation.mutate(deleteId)}
        title="Delete Offer"
        description="Are you sure you want to delete this promotional offer? This cannot be undone."
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
