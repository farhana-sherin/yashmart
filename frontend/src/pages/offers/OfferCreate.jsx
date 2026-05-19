import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Tag } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { offerService } from "@/services/offer.service";
import OfferForm from "@/components/offers/OfferForm";
import { Button } from "@/components/ui/button";

export default function OfferCreate() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: offerService.createOffer,
    onSuccess: () => {
      queryClient.invalidateQueries(["offers"]);
      toast.success("Offer created successfully");
      navigate("/offers");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create offer");
    },
  });

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
            <h1 className="text-2xl font-bold tracking-tight">Create Promotional Offer</h1>
            <p className="text-muted-foreground">Setup a new discount campaign for your store.</p>
          </div>
        </div>

        <OfferForm 
          onSubmit={(data) => mutation.mutate(data)} 
          isLoading={mutation.isPending} 
        />
      </div>
    </div>
  );
}
