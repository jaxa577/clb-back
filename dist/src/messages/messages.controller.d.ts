import { MessagesService } from './messages.service';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    getChatList(req: any): Promise<{
        id: string;
        otherUser: {
            id: string;
            role: import(".prisma/client").$Enums.Role;
            name: string;
        } | null;
        lastMessage: ({
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
        }) | null;
        unreadCount: number;
        updatedAt: Date;
    }[]>;
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
