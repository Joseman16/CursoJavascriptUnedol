import {removeBackground} from '@imgly/background-removal-node'
import { error } from 'console';
import fs from 'fs';
import path from 'path';
import { arrayBuffer } from 'stream/consumers';

const inputPath = "./img/car2.jpeg";
const outputPath = "./imgRemove/car2Remove.jpeg"

if(!fs.existsSync(inputPath)){
    console.error(`Input file not found: ${inputPath}`);
    process.exit(1);
}

const absolutePath = path.resolve(inputPath)
const imageUrl = `file://${absolutePath}`

async function blobToBuffer(blob){
    const arrayBuffer = await blob.arrayBuffer();
    return Buffer.from (arrayBuffer);
}

async function main() {
    try{
        const blob = await removeBackground(imageUrl);
        console.log("Background removed successfully");
        const buffer = await blobToBuffer(blob);
        fs.writeFileSync(outputPath, buffer);
    }catch(error){
        console.error(error);
    }
}

main();