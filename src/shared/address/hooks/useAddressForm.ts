import { useEffect, useState } from "react";

import { cityService } from "../../city/services/city.service";
import type { LocationOption } from "../../location/types/location";
import { locationService } from "../../location/services/location.service";
import type { AddressFormData } from "../types/addressForm";
import { useToast } from "../../components/ToastProvider";

const EMPTY_ADDRESS: AddressFormData = {
  label: "",
  fullName: "",
  address: "",
  aptSuiteUnit: "",
  cityName: "",
  cityUid: "",
  provinceUid: "",
  provinceName: "",
  countryUid: "",
  countryName: "",
  postalCode: "",
  notes: "",
  phone: "",
  isDefault: false,
};

export function useAddressForm(initialData?: AddressFormData) {
  const [formData, setFormData] = useState<AddressFormData>(
    () => initialData ?? EMPTY_ADDRESS,
  );
  const [selectionType, setSelectionType] = useState<
    "country" | "province" | "city" | null
  >(null);
  const [countries, setCountries] = useState<LocationOption[]>([]);
  const [provinces, setProvinces] = useState<LocationOption[]>([]);
  const [cities, setCities] = useState<LocationOption[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    let isActive = true;
    locationService
      .getCountries()
      .then((items) => {
        if (isActive) {
          const options = items.map(({ uid, name, code }) => ({
            uid,
            name,
            subtitle: code,
          }));
          setCountries(options);
          const selectedCountry = options.find(
            (option) => option.uid === formData.countryUid,
          );
          if (initialData && selectedCountry) {
            setFormData((previous) => ({
              ...previous,
              countryName: selectedCountry.name,
            }));
          }
        }
      })
      .catch((error: unknown) => {
        if (isActive) {
          showToast(
            error instanceof Error
              ? error.message
              : "Unable to load countries.",
          );
        }
      })
      .finally(() => {
        if (isActive) setIsLoadingCountries(false);
      });

    return () => {
      isActive = false;
    };
  }, [showToast]);

  useEffect(() => {
    if (!formData.countryUid) {
      setProvinces([]);
      return;
    }

    let isActive = true;
    setIsLoadingProvinces(true);
    locationService
      .getProvinces(formData.countryUid)
      .then((items) => {
        if (isActive) {
          const options = items.map(({ uid, name, code }) => ({
            uid,
            name,
            subtitle: code,
          }));
          setProvinces(options);
          const selectedProvince = options.find(
            (option) => option.uid === formData.provinceUid,
          );
          if (initialData && selectedProvince) {
            setFormData((previous) => ({
              ...previous,
              provinceName: selectedProvince.name,
            }));
          }
        }
      })
      .catch((error: unknown) => {
        if (isActive) {
          showToast(
            error instanceof Error
              ? error.message
              : "Unable to load provinces.",
          );
        }
      })
      .finally(() => {
        if (isActive) setIsLoadingProvinces(false);
      });

    return () => {
      isActive = false;
    };
  }, [formData.countryUid, showToast]);

  useEffect(() => {
    if (!formData.provinceUid) {
      setCities([]);
      return;
    }

    let isActive = true;
    setIsLoadingCities(true);
    cityService
      .getCities({ provinceUid: formData.provinceUid, page: 1, limit: 100 })
      .then((response) => {
        if (!Array.isArray(response.data)) {
          throw new Error("The cities response did not include a valid list.");
        }
        if (isActive) {
          const options = response.data.map(({ uid, name }) => ({ uid, name }));
          setCities(options);
          const selectedCity = options.find(
            (option) => option.uid === formData.cityUid,
          );
          if (initialData && selectedCity) {
            setFormData((previous) => ({
              ...previous,
              cityName: selectedCity.name,
            }));
          }
        }
      })
      .catch((error: unknown) => {
        if (isActive) {
          showToast(
            error instanceof Error ? error.message : "Unable to load cities.",
          );
        }
      })
      .finally(() => {
        if (isActive) setIsLoadingCities(false);
      });

    return () => {
      isActive = false;
    };
  }, [formData.provinceUid, showToast]);

  const updateField = (
    field: keyof AddressFormData,
    value: string | boolean,
  ) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
  };

  const selectLocation = (option: LocationOption) => {
    if (selectionType === "country") {
      setFormData((previous) => ({
        ...previous,
        countryUid: option.uid,
        countryName: option.name,
        provinceUid: "",
        provinceName: "",
        cityUid: "",
        cityName: "",
      }));
    } else if (selectionType === "province") {
      setFormData((previous) => ({
        ...previous,
        provinceUid: option.uid,
        provinceName: option.name,
        cityUid: "",
        cityName: "",
      }));
    } else if (selectionType === "city") {
      setFormData((previous) => ({
        ...previous,
        cityUid: option.uid,
        cityName: option.name,
      }));
    }
    setSelectionType(null);
  };

  return {
    formData,
    updateField,
    cities,
    countries,
    provinces,
    selectionType,
    setSelectionType,
    isLoadingCountries,
    isLoadingProvinces,
    isLoadingCities,
    isLoadingOptions:
      selectionType === "country"
        ? isLoadingCountries
        : selectionType === "province"
          ? isLoadingProvinces
          : isLoadingCities,
    selectLocation,
  };
}
