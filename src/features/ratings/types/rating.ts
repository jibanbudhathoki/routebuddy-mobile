export interface RateDriverPayload {
  score: number;
  comment?: string;
}

export interface RateDriverResponse {
  message: string;
}

export interface SubmitDriverRatingInput extends RateDriverPayload {
  requestUid: string;
}
