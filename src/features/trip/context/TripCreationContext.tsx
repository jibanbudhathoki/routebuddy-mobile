import React, { createContext, useContext, useState, ReactNode } from "react";
import type { CreateTripRequest } from "../types/trip";

interface TripCreationContextType {
  tripData: Partial<CreateTripRequest>;
  updateTripData: (data: Partial<CreateTripRequest>) => void;
  resetTripData: () => void;
}

const TripCreationContext = createContext<TripCreationContextType | undefined>(
  undefined,
);

export function TripCreationProvider({ children }: { children: ReactNode }) {
  const [tripData, setTripData] = useState<Partial<CreateTripRequest>>({
    capacity: 1,
    stores: [],
    notes: "",
  });

  const updateTripData = (newData: Partial<CreateTripRequest>) => {
    setTripData((prev) => ({ ...prev, ...newData }));
  };

  const resetTripData = () => {
    setTripData({
      capacity: 1,
      stores: [],
      notes: "",
    });
  };

  return (
    <TripCreationContext.Provider
      value={{ tripData, updateTripData, resetTripData }}
    >
      {children}
    </TripCreationContext.Provider>
  );
}

export function useTripCreation() {
  const context = useContext(TripCreationContext);
  if (context === undefined) {
    throw new Error(
      "useTripCreation must be used within a TripCreationProvider",
    );
  }
  return context;
}
