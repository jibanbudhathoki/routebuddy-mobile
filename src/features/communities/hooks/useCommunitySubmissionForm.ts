import { useEffect, useState } from "react";
import { z } from "zod";

import { cityService } from "../../../shared/city/services/city.service";
import type { City } from "../../../shared/city/types/city";
import { locationService } from "../../../shared/location/services/location.service";
import type {
  Country,
  Province,
} from "../../../shared/location/types/location";
import { submitCommunityPayloadSchema } from "../validations/community";
import type {
  CommunityType,
  SubmitCommunityPayload,
} from "../types/community";

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Community name must be at least 2 characters.")
    .max(100, "Community name must be 100 characters or fewer."),
  description: z
    .string()
    .trim()
    .max(120, "Description must be 120 characters or fewer."),
  provinceUid: z.string().min(1, "Select a province."),
  cityUid: z.string().min(1, "Select a city."),
});

type Errors = Record<string, string>;

export function useCommunitySubmissionForm(
  visible: boolean,
  onSubmit: (
    payload: SubmitCommunityPayload,
  ) => Promise<{ success: true } | { success: false; error: string }>,
) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<CommunityType | null>(null);
  const [countryUid, setCountryUid] = useState("");
  const [countryName, setCountryName] = useState("");
  const [provinceUid, setProvinceUid] = useState("");
  const [provinceName, setProvinceName] = useState("");
  const [cityUid, setCityUid] = useState("");
  const [cityName, setCityName] = useState("");
  const [countries, setCountries] = useState<Country[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selection, setSelection] = useState<"country" | "province" | "city" | null>(null);
  const [loadingCountry, setLoadingCountry] = useState(false);
  const [loadingProvince, setLoadingProvince] = useState(false);
  const [loadingCity, setLoadingCity] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    let active = true;
    setLoadingCountry(true);
    setLocationError(null);
    locationService
      .getCountries()
      .then((items) => {
        if (active) setCountries(items);
      })
      .catch((failure: unknown) => {
        if (active) setLocationError(getErrorMessage(failure, "Unable to load countries."));
      })
      .finally(() => {
        if (active) setLoadingCountry(false);
      });
    return () => {
      active = false;
    };
  }, [visible]);

  useEffect(() => {
    if (!visible || !countryUid) {
      setProvinces([]);
      return;
    }
    let active = true;
    setLoadingProvince(true);
    setLocationError(null);
    locationService
      .getProvinces(countryUid)
      .then((items) => {
        if (active) setProvinces(items);
      })
      .catch((failure: unknown) => {
        if (active) setLocationError(getErrorMessage(failure, "Unable to load provinces."));
      })
      .finally(() => {
        if (active) setLoadingProvince(false);
      });
    return () => {
      active = false;
    };
  }, [countryUid, visible]);

  useEffect(() => {
    if (!visible || !provinceUid) {
      setCities([]);
      return;
    }
    let active = true;
    setLoadingCity(true);
    setLocationError(null);
    cityService
      .getCities({ provinceUid, page: 1, limit: 100 })
      .then((response) => {
        if (!Array.isArray(response.data)) {
          throw new Error("The cities response did not include a valid list.");
        }
        if (active) setCities(response.data);
      })
      .catch((failure: unknown) => {
        if (active) setLocationError(getErrorMessage(failure, "Unable to load cities."));
      })
      .finally(() => {
        if (active) setLoadingCity(false);
      });
    return () => {
      active = false;
    };
  }, [provinceUid, visible]);

  const retryLocations = async () => {
    setLocationError(null);
    try {
      if (!countryUid) {
        setLoadingCountry(true);
        setCountries(await locationService.getCountries());
      } else if (!provinceUid) {
        setLoadingProvince(true);
        setProvinces(await locationService.getProvinces(countryUid));
      } else {
        setLoadingCity(true);
        const response = await cityService.getCities({
          provinceUid,
          page: 1,
          limit: 100,
        });
        if (!Array.isArray(response.data)) {
          throw new Error("The cities response did not include a valid list.");
        }
        setCities(response.data);
      }
    } catch (failure) {
      setLocationError(getErrorMessage(failure, "Unable to load location options."));
    } finally {
      setLoadingCountry(false);
      setLoadingProvince(false);
      setLoadingCity(false);
    }
  };

  const selectLocation = (uid: string, value: string) => {
    if (selection === "country") {
      setCountryUid(uid);
      setCountryName(value);
      setProvinceUid("");
      setProvinceName("");
      setCityUid("");
      setCityName("");
    } else if (selection === "province") {
      setProvinceUid(uid);
      setProvinceName(value);
      setCityUid("");
      setCityName("");
    } else if (selection === "city") {
      setCityUid(uid);
      setCityName(value);
    }
    setSelection(null);
  };

  const reset = () => {
    setName("");
    setDescription("");
    setType(null);
    setCountryUid("");
    setCountryName("");
    setProvinceUid("");
    setProvinceName("");
    setCityUid("");
    setCityName("");
    setSelection(null);
    setErrors({});
    setSubmitError(null);
    setLocationError(null);
  };

  const submitForm = async () => {
    setSubmitError(null);
    const result = formSchema.safeParse({
      name,
      description,
      provinceUid,
      cityUid,
    });
    if (!result.success) {
      const nextErrors: Errors = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0];
        if (typeof key === "string") nextErrors[key] = issue.message;
      });
      setErrors(nextErrors);
      return false;
    }
    setErrors({});
    const payload = submitCommunityPayloadSchema.safeParse({
      name: result.data.name,
      provinceUid: result.data.provinceUid,
      cityUid: result.data.cityUid,
      ...(result.data.description ? { description: result.data.description } : {}),
      ...(type ? { type } : {}),
    });
    if (!payload.success) {
      setSubmitError(payload.error.issues[0]?.message ?? "Check your community details.");
      return false;
    }
    const response = await onSubmit(payload.data);
    if (!response.success) {
      setSubmitError(response.error);
      return false;
    }
    reset();
    return true;
  };

  return {
    name,
    setName,
    description,
    setDescription,
    type,
    setType,
    countryUid,
    countryName,
    provinceUid,
    provinceName,
    cityUid,
    cityName,
    countries,
    provinces,
    cities,
    selection,
    setSelection,
    loadingCountry,
    loadingProvince,
    loadingCity,
    locationError,
    errors,
    submitError,
    retryLocations,
    selectLocation,
    submitForm,
    reset,
  };
}

function getErrorMessage(failure: unknown, fallback: string) {
  return failure instanceof Error && failure.message ? failure.message : fallback;
}
