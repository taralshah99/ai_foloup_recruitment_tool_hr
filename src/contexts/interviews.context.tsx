"use client";

import React, { useState, useContext, ReactNode, useEffect } from "react";
import { Interview } from "@/types/interview";
import { getAllInterviews, getInterviewById as getInterviewByIdService } from "@/services/interviews.service";
import { useClerk, useOrganization } from "@clerk/nextjs";

interface InterviewContextProps {
  interviews: Interview[];
  setInterviews: React.Dispatch<React.SetStateAction<Interview[]>>;
  getInterviewById: (interviewId: string) => Promise<Interview | null | any>;
  interviewsLoading: boolean;
  setInterviewsLoading: (interviewsLoading: boolean) => void;
  fetchInterviews: () => void;
}

export const InterviewContext = React.createContext<InterviewContextProps>({
  interviews: [],
  setInterviews: () => {},
  getInterviewById: async () => null,
  setInterviewsLoading: () => undefined,
  interviewsLoading: false,
  fetchInterviews: () => {},
});

interface InterviewProviderProps {
  children: ReactNode;
}

export function InterviewProvider({ children }: InterviewProviderProps) {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const { user } = useClerk();
  const { organization } = useOrganization();
  const [interviewsLoading, setInterviewsLoading] = useState(false);

  const fetchInterviews = async () => {
    try {
      setInterviewsLoading(true);
      const response = await getAllInterviews(
        user?.id as string,
        organization?.id as string,
      );
      setInterviewsLoading(false);
      setInterviews(response);
    } catch (error) {
      console.error(error);
    }
    setInterviewsLoading(false);
  };

  const getInterviewById = async (interviewId: string) => {
    const response = await getInterviewByIdService(interviewId);

    return response;
  };

  useEffect(() => {
    if (organization?.id || user?.id) {
      fetchInterviews();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organization?.id, user?.id]);

  return (
    <InterviewContext.Provider
      value={{
        interviews,
        setInterviews,
        getInterviewById,
        interviewsLoading,
        setInterviewsLoading,
        fetchInterviews,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
}

export const useInterviews = () => {
  const value = useContext(InterviewContext);

  return value;
};
