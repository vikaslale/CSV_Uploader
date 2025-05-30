import { CsvService } from './csv.service';
export declare class CsvController {
    private CsvService;
    constructor(CsvService: CsvService);
    uploadFile(file: Express.Multer.File): Promise<{
        message: string;
    }>;
    getDataSearch(): Promise<{
        name: {
            firstName: string;
            lastName: string;
        };
        age: number;
        address: import("@prisma/client/runtime/library").JsonValue;
        gender: any;
    }[]>;
}
