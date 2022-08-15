export type HuddleInfo = {
  readonly channel_id: string;
  readonly call_id: string;
  readonly active_members: ReadonlyArray<string> | null;
  readonly dropped_members: ReadonlyArray<string> | null;
};

export type HuddleAPIResponse = {
  readonly ok: boolean;
  readonly error?: HuddleApiErrors;
  readonly huddles?: ReadonlyArray<HuddleInfo>;
};

export enum HuddleApiErrors {
  INVALID_AUTH = 'invalid_auth',
}

export type HuddleDocument = {
  readonly call_id: string;
  readonly members: ReadonlyArray<string> | null;
  notificationSent: boolean;
};

export type UserDocument = {
  readonly user_id: string;
  isSubscribing: boolean;
};

export enum SubscribeEvent {
  SUBSCRIBE = '/evosub',
  UNSUBSCRIBE = '/evounsub',
}
