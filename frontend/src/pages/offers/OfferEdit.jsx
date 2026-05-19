import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Tag } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { offerService } from "@/services/offer.service";
import OfferForm from "@/components/offers/OfferForm";
import { Button } from "@/components/ui/button";
import PageLoader from "@/components/loaders/PageLoader";

export default function OfferEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: offer, isLoading: isFetchLoading } = useQuery({
    queryKey: ["offer", id],
    queryFn: () => offerService.getOffer(id),
  });

  const mutation = useMutation({
    mutationFn: (data) => offerService.updateOffer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["offers"]);
      queryClient.invalidateQueries(["offer", id]);
      toast.success("Offer updated successfully");
      navigate("/offers");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update offer");
    },
  });

  if (isFetchLoading) return <PageLoader />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" className="gap-2" onClick={() => navigate("/offers")}>
        <ArrowLeft size={18} /> Back to Offers
      </Button>

      <div className="bg-card p-8 rounded-xl border shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            <Tag size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Offer</h1>
            <p className="text-muted-foreground">Modify promotional details or update the campaign banner.</p>
          </div>
        </div>

        <OfferForm 
          initialData={offer}
          onSubmit={(data) => mutation.mutate(data)} 
          isLoading={mutation.isPending} 
        />
      </div>
    </div>
  );
}
