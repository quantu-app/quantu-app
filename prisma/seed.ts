import { PrismaClient } from '@prisma/client'
import fs from "fs";
import { parse } from "csv-parse";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });

async function readDepartments() {
    const deps: { name: string, url: string }[] = []
    const parser = fs.createReadStream(path.resolve(__dirname, "./seed_data/departments.csv"))
        .pipe(parse({ delimiter: "|", from_line: 2 }));

    for await (const record of parser) {
        deps.push({ name: record[0], url: record[1] });
    }
    return deps
}

async function main() {
    const DEPARTMENTS = await readDepartments();

    DEPARTMENTS.forEach(async (department) => {
        const result = await client.department.upsert({
            where: { url: department.url },
            update: {},
            create: {
                url: department.url,
                name: department.name,
                description: ""
            }
        });

        console.info(result);
    });
}

main()
    .then(async () => {
        await client.$disconnect()
    })
    .catch(async (error) => {
        console.error(error)
        await client.$disconnect()
        process.exit(1)
    })