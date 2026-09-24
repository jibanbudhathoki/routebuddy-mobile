import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { addressService } from '../services/address.service';
import { Address, CreateAddressDto, UpdateAddressDto } from '../types/address';

export function useAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response: any = await addressService.getAddresses();
      const addressesArray = Array.isArray(response) ? response : response?.data || [];
      setAddresses(addressesArray);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch addresses.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAddresses();
    }, [fetchAddresses])
  );

  const createAddress = async (dto: CreateAddressDto) => {
    try {
      const newAddress = await addressService.createAddress(dto);
      setAddresses((prev) => [...prev, newAddress]);
      return newAddress;
    } catch (err: any) {
      console.error('Failed to create address:', err);
      throw err;
    }
  };

  const updateAddress = async (uid: string, dto: UpdateAddressDto) => {
    try {
      const updated = await addressService.updateAddress(uid, dto);
      setAddresses((prev) =>
        prev.map((addr) => (addr.uid === uid ? updated : addr))
      );
      return updated;
    } catch (err: any) {
      console.error('Failed to update address:', err);
      throw err;
    }
  };

  const deleteAddress = async (uid: string) => {
    try {
      await addressService.deleteAddress(uid);
      setAddresses((prev) => prev.filter((addr) => addr.uid !== uid));
    } catch (err: any) {
      console.error('Failed to delete address:', err);
      throw err;
    }
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
