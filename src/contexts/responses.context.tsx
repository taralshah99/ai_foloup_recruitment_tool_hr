"use client";

import { createResponse as createResponseService, saveResponse as saveResponseService } from "@/services/responses.service";
import React, { useContext } from "react";

interface Response {
  createResponse: (payload: any) => Promise<any>;
  saveResponse: (payload: any, call_id: string) => Promise<void>;
}

export const ResponseContext = React.createContext<Response>({
  createResponse: async () => {},
  saveResponse: async () => {},
});

interface ResponseProviderProps {
  children: React.ReactNode;
}

export function ResponseProvider({ children }: ResponseProviderProps) {
  const createResponse = async (payload: any) => {
    const data = await createResponseService({ ...payload });

    return data;
  };

  const saveResponse = async (payload: any, call_id: string) => {
    await saveResponseService({ ...payload }, call_id);
  };

  return (
    <ResponseContext.Provider
      value={{
        createResponse,
        saveResponse,
      }}
    >
      {children}
    </ResponseContext.Provider>
  );
}

export const useResponses = () => {
  const value = useContext(ResponseContext);

  return value;
};
