import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs'
import * as path from 'path'
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CsvService {
  
   //default cheunk size
    chunkSize =100;
  private readonly logger = new Logger(this.constructor.name)
  constructor(
    private readonly prismaService: PrismaService
  ) { }

  async uploadFiles(file: Express.Multer.File) {
    if (!file || !file.path) {
      throw new Error('File path is undefined');
    }
    if(!file.originalname.endsWith('.csv')){
     throw new BadRequestException('Only CSV files are allowed!')
    }
    const filePath = path.join(process.cwd(), file.path)
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    const lines = fileContent.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(',');


    const records = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const record: Record<string, string> = {}

      headers.forEach((header, index) => {
        record[header] = values[index] || ''
      });

      const userData = this.tranformdata(record)
      records.push(userData)
    }
    const chunks = this.chunkify(records, this.chunkSize)

    for (const chunk of chunks) {
      await this.prismaService.user_details.createMany({
        data: chunk,
        skipDuplicates: true
      })
    }
    await this.agegroup()
    return {
      message: 'file uploaded successfully'
    }
  }


  tranformdata(obj: Record<string, string>) {
    const firstName = obj['name.firstName'] || ''
    const lastName = obj['name.lastName'] || ''
    const name = `${firstName} ${lastName}`.trim();

    const age = parseInt(obj['age'] || '0');


    const address: Record<string, string> = {}
    for (const key in obj) {
      if (key.startsWith('address.')) {
        const pards = key.split('.');
        if (pards.length === 2) {
          address[pards[1]] = obj[key]
        }
      }

    }

    const additionalInfo: Record<string, string> = {}
    for (const key in obj) {
      const isName = key === 'name.firstName' || key === 'name.lastName';
      const isAge = key === 'age';
      const isAddress = key.startsWith('address');
      if (!isName && !isAge && !isAddress) {
        const clearKey = key.replace('\r', '');
        additionalInfo[clearKey] = obj[key];
      }
    }
    //  console.log(name)
    return { name, age, address, additionalInfo }
  }

  chunkify(data, chunkSize = this.chunkSize) {
    var chunks = []
    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      chunks.push(chunk)
    }
    return chunks
  }


  async agegroup(){
     const users = await this.prismaService.user_details.findMany({
      select :{
        age:true
      }
     })

     const total= users.length;

     const groupCounts = users.reduce((acc,{age})=>{
       if(age<20) acc['<20']++;
       else if(age <=40) acc ['20-40']++;
       else if (age <=60) acc['40-60']++
       else acc['>60']++;
       return acc;
     }, {'<20':0,'20-40':0,'40-60':0,'>60':0})
     
     console.log('age geoup & Distribution:')
     Object.entries(groupCounts).forEach(([range,count])=>{
       console.log(`${range}: ${(count *100/total).toFixed(2)}%`)
     })
  }

 async getSearchData(){
    const users = await this.prismaService.user_details.findMany({
      select:{
        name:true,
        age:true,
       address:true,
      additionalInfo:true
    }
    })
    
   return  users.map(user=>{
        const parts = user.name?.split(' ') || [];
    const firstName = parts.slice(0, -1).join(' ') + (parts.length > 1 ? ' ' : '');
    const lastName = parts.slice(-1).join('');

      const additional = typeof user.additionalInfo === 'object' && user.additionalInfo !== null
      ? (user.additionalInfo as Record<string, any>)
      : {};


       return {
        name:{
         firstName,
         lastName

        },
        age: user.age,
        address: user.address,
         gender:additional?.gender ||''
       }
    })
  }

}
