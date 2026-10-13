import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { addressService } from "../services/address.service";
import type { Address, CreateAddressDto, UpdateAddressDto } from "../types/address";

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function useAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setAddresses(await addressService.getAddresses());
    } catch (fetchError: unknown) {
      setError(getErrorMessage(fetchError, "Failed to fetch addresses."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void fetchAddresses();
    }, [fetchAddresses]),
  );

  const createAddress = async (dto: CreateAddressDto) => {
    const created = await addressService.createAddress(dto);
    setAddresses((current) => [...current, created]);
    return created;
  };

  const updateAddress = async (uid: string, dto: UpdateAddressDto) => {
    const response = await addressService.updateAddress(uid, dto);
    const existing = addresses.find((address) => address.uid === uid);
    if (!existing) {
      throw new Error("The address could not be found after updating.");
    }
    const updatedAddress: Address = { ...existing, ...dto, ...response, uid };
    setAddresses((current) =>
      current.map((address) => (address.uid === uid ? updatedAddress : address)),
    );
    return updatedAddress;
  };

  const deleteAddress = async (uid: string) => {
    await addressService.deleteAddress(uid);
    setAddresses((current) => current.filter((address) => address.uid !== uid));
  };

  return {
    addresses,
    isLoading,
    error,
    refetch: fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
  };
}
