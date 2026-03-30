import { PrismaService } from '../prisma/prisma.service';
export declare class MessagesService {
    private prisma;
    constructor(prisma: PrismaService);
    getChat(userId: string, otherUserId: string): Promise<({
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
    sendMessage(senderId: string, receiverId: string, content: string): Promise<{
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
    getChatList(userId: string): Promise<{
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
}
