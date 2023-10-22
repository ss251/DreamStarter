import React, { createContext, useContext, useState } from "react";

interface FormMessage {
  description: string;
  title: string;
  priceperNFT: number;
  funding_goal: number;
  proposal_type: string;
  date: string;
}

interface ProposalContextType {
  proposal: FormMessage | null;
  setProposal: React.Dispatch<React.SetStateAction<FormMessage | null>>;
  votes: { likes: number; dislikes: number };
  setVotes: React.Dispatch<React.SetStateAction<{ likes: number; dislikes: number }>>;
  votesPercentage: number;
  setVotesPercentage: React.Dispatch<React.SetStateAction<number>>;
}

const ProposalContext = createContext<ProposalContextType | undefined>(
  undefined
);

export const useProposal = () => {
  const context = useContext(ProposalContext);
  if (!context) {
    throw new Error("useProposal must be used within a ProposalProvider");
  }
  return context;
};

export const ProposalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [proposal, setProposal] = useState<FormMessage | null>(null);
  const [votes, setVotes] = useState<{ likes: number; dislikes: number }>({ likes: 0, dislikes: 0 });
  const [votesPercentage, setVotesPercentage] = useState<number>(0);

  return (
      <ProposalContext.Provider value={{ proposal, setProposal, votes, setVotes, votesPercentage, setVotesPercentage }}>
          {children}
      </ProposalContext.Provider>
  );
};
