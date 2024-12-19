export interface IVote {
    id: number;
}

export interface IFeedback {
    id: number;
    title: string;
    description: string;
    createdAt: string;
    status: string;
    category: string;
    userId: number;
    clicked: boolean;
    votes: IVote[];
}
