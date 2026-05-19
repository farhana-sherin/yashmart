import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/loaders/Spinner";

export default function RewardActionModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  label,
  type = "number",
  isLoading,
}) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(value);
    setValue("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reward-value">{label}</Label>
          <Input
            id="reward-value"
            type={type}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter amount..."
            required
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Spinner className="mr-2" /> : "Confirm"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
