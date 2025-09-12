import { IClaim } from "../types/claims/IClaim";

export const searchClaim = (claims: IClaim[], keyword: string): IClaim[] => {
  const lowerKeyword = keyword.toLowerCase();

  return claims.filter((claim) =>
    claim.answers.some((answer) =>
      answer.input_string?.toLowerCase().includes(lowerKeyword)
    )
  );
};