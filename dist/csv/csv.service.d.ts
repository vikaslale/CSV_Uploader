import { PrismaService } from 'src/prisma/prisma.service';
export declare class CsvService {
    private readonly prismaService;
    chunkSize: number;
    private readonly logger;
    constructor(prismaService: PrismaService);
    uploadFiles(file: Express.Multer.File): Promise<{
        message: string;
    }>;
    tranformdata(obj: Record<string, string>): {
        name: string;
        age: number;
        address: Record<string, string>;
        additionalInfo: Record<string, string>;
    };
    chunkify(data: any, chunkSize?: number): any[];
    agegroup(): Promise<void>;
    getSearchData(): Promise<{
        name: {
            firstName: string;
            lastName: string;
        };
        age: number;
        address: import("@prisma/client/runtime/library").JsonValue;
        gender: any;
    }[]>;
}
