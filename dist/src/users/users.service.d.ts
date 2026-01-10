import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findOne(id: string): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        name: string;
        phone: string | null;
        rating: number;
        verified: boolean;
        createdAt: Date;
    }>;
    findAll(): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        name: string;
        phone: string | null;
        rating: number;
        verified: boolean;
        createdAt: Date;
    }[]>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        name: string;
        phone: string | null;
        rating: number;
        verified: boolean;
        createdAt: Date;
    }>;
    getUserStats(): Promise<{
        totalUsers: number;
        usersByRole: {};
    }>;
}
