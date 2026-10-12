import { ConfirmationDialog } from "../../../shared/components/ConfirmationDialog";

interface DeleteTripConfirmationModalProps {
  visible: boolean;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteTripConfirmationModal({
  visible,
  isDeleting,
  onCancel,
  onConfirm,
}: DeleteTripConfirmationModalProps) {
  return (
    <ConfirmationDialog
      visible={visible}
      title="Delete Trip?"
      message="Are you sure you want to delete this trip? This action cannot be undone."
      icon="trash-can-outline"
      confirmLabel="Delete Trip"
      cancelLabel="Keep Trip"
      isLoading={isDeleting}
      destructive
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}
