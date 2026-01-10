import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMyProfile(req: any): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        name: string;
        phone: string | null;
        rating: number;
        verified: boolean;
        createdAt: Date;
    }>;
    updateMyProfile(req: any, updateUserDto: UpdateUserDto): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        name: string;
        phone: string | null;
        rating: number;
        verified: boolean;
        createdAt: Date;
    }>;
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
}
