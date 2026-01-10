import { PrismaService } from '../prisma/prisma.service';
export declare class ReviewsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(fromUserId: string, toUserId: string, rating: number, comment?: string): Promise<{
        fromUser: {
            id: string;
            name: string;
        };
        toUser: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        rating: number;
        createdAt: Date;
        comment: string | null;
        fromUserId: string;
        toUserId: string;
    }>;
    getUserReviews(userId: string): Promise<({
        fromUser: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        rating: number;
        createdAt: Date;
        comment: string | null;
        fromUserId: string;
        toUserId: string;
    })[]>;
}
