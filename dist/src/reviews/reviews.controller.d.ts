import { ReviewsService } from './reviews.service';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    create(body: {
        toUserId: string;
        rating: number;
        comment?: string;
    }, req: any): Promise<{
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
