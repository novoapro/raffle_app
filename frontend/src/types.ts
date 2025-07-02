export type Participant = {
  id: string;
  name: string;
  tickets: number;
  animal: string;
  prizes: string[];
  photo_path?: string;
}

export type Prize = {
  id: string;
  name: string;
  description?: string;
  photo_path?: string;
  quantity: number;
  remaining: number;
  winners: string[];
}

export type ApiResponse = {
  status: 'success' | 'error';
  message?: string;
  participant?: Participant;
  winner?: string;
  tickets?: number;
  animal?: string;
  photo?: string;
  prize?: string;
  prize_photo?: string;
  settings?: RaffleSettings;
}

export type RaffleSettings = {
  allow_multiple_wins: boolean;
  auto_prize_selection: boolean;
}

export type AddParticipantPayload = Partial<Participant> & { addAnother?: boolean };