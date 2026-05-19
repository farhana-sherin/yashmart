import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ImagePlus, X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/loaders/Spinner";

const offerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  discount_percentage: z.coerce.number().min(0).max(100),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  banner: z.any().optional(),
});

export default function OfferForm({ initialData, onSubmit, isLoading }) {
  const [preview, setPreview] = useState(initialData?.banner || null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(offerSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      discount_percentage: 0,
      start_date: "",
      end_date: "",
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setValue("banner", e.target.files);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        {/* Banner Upload */}
        <div className="space-y-2">
          <Label>Offer Banner</Label>
          <div className="relative group cursor-pointer border-2 border-dashed rounded-xl overflow-hidden hover:border-primary transition-colors h-48 flex items-center justify-center bg-muted/30">
            {preview ? (
              <>
                <img src={preview} alt="Banner Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setPreview(null); setValue("banner", null); }}
                  className="absolute top-2 right-2 p-1.5 bg-background/80 rounded-full text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <label className="w-full h-full flex flex-col items-center justify-center gap-2 cursor-pointer">
                <ImagePlus size={32} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground font-medium">Click to upload banner image</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Offer Title</Label>
            <Input id="title" placeholder="Summer Sale 2024" {...register("title")} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount">Discount Percentage (%)</Label>
            <Input id="discount" type="number" placeholder="20" {...register("discount_percentage")} />
            {errors.discount_percentage && <p className="text-xs text-destructive">{errors.discount_percentage.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            className="w-full min-h-[100px] rounded-lg border bg-background px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
            placeholder="Describe the offer details..."
            {...register("description")}
          />
          {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start_date">Start Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="start_date" type="date" className="pl-9" {...register("start_date")} />
            </div>
            {errors.start_date && <p className="text-xs text-destructive">{errors.start_date.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="end_date">End Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="end_date" type="date" className="pl-9" {...register("end_date")} />
            </div>
            {errors.end_date && <p className="text-xs text-destructive">{errors.end_date.message}</p>}
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full h-11" disabled={isLoading}>
        {isLoading ? <Spinner className="mr-2" /> : null}
        {initialData ? "Update Offer" : "Create Offer"}
      </Button>
    </form>
  );
}
