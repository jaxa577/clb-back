import { MessagesService } from './messages.service';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    getChat(userId: string, req: any): Promise<({
        sender: {
            id: string;
            name: string;
        };
        receiver: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        content: string;
        senderId: string;
        receiverId: string;
    })[]>;
    sendMessage(body: {
        receiverId: string;
        content: string;
    }, req: any): Promise<{
        sender: {
            id: string;
            name: string;
        };
        receiver: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        content: string;
        senderId: string;
        receiverId: string;
    }>;
}
