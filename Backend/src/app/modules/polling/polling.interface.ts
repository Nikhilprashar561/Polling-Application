export interface createPoll {
  title: string;
  description: string;
  isAnonymous: boolean;
  requiresAuth: boolean;
  status: string;
  pollLink: string;
  expiresAt: string;
}

export interface PollIdParams {
  pollId: string;
}

export interface PollLinkParams {
  pollLink: string;
}

export interface updatePoll {
  title: string;
  description: string;
  isAnonymous: boolean;
  requiresAuth: boolean;
  status: string;
  expiresAt: string;
}

export interface questionOptions {
  questionText: string;
  isRequired: boolean;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
}

export interface questionId {
    questionId: string
}
