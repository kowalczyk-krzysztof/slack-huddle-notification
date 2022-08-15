export type HuddleInfo = {
  readonly channel_id: string;
  readonly call_id: string;
  readonly active_members: ReadonlyArray<string> | null;
  readonly dropped_members: ReadonlyArray<string> | null;
};

export type HuddleAPIResponse = {
  readonly ok: boolean;
  readonly error?: string;
  readonly huddles?: ReadonlyArray<HuddleInfo>;
};