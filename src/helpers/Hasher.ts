import * as crypto from 'crypto';

const digest = 'sha512';
function iters(iterations: number|undefined) : number {
    if( iterations != undefined) return 99999;
    return Math.ceil((Math.random()*5000) + 5000);    
}
const keyLength = 1024;

/** Hash a password */
export async function hash(password: string, iteration?: number):Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            let salt = crypto.randomBytes(keyLength);
            let iterations = iters(iteration);
            let key = crypto.pbkdf2Sync(password, salt, iterations, keyLength, digest);
            
            var buffer = Buffer.alloc(keyLength * 2);            

            salt.copy(buffer);
            key.copy(buffer, salt.length);
            
            let hash = buffer.toString('base64');
            resolve(SetIterations(hash,iterations));
        } catch (e) {
            reject(e);
        }
    });
}

/** Compare a password to a hash and see if they the same */
export async function Verify(password: string, hashed: string) : Promise<boolean>{
    return new Promise((resolve, reject) => {
        let iterations = RemoveIterations(hashed);
        let hash = iterations.hash;
        let iters = iterations.iters;

        var buff = Buffer.alloc(keyLength*2,hash, 'base64');
        var salt = buff.slice(0, keyLength);
        var keyA = buff.slice(keyLength, keyLength * 2);

        let keyB = crypto.pbkdf2Sync(password, salt, iters, keyLength, digest);
        
        resolve(keyA.compare(keyB) == 0);
    });
}

function RemoveIterations(hash: string) : {hash:string,iters:number}{
    if(!hash.startsWith("-")) return {hash:hash,iters:99999};
    
    let sliced = hash.slice(1);
    let index = sliced.indexOf("-");
    let number = sliced.substr(0,index);

    let newHash = hash.slice(index + 2);
    let iterations = parseInt(decrypt(number));
    return {hash:newHash,iters:iterations};
}

function SetIterations(hash: string, iterations : number) : string{
    if(iterations == 99999){
        return hash;
    }
    return `-${encrypt(iterations.toString())}-${hash}`;
}

const algorithm = 'aes-256-cbc';
const pass = process.env.PASSWORD_ENCR;
const defaultPass = "hnwaxyn781no28yx787n2891xn87d6x230x713x13x";

export function encrypt(text:string) {
    let key = GetKey();  
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return encrypted.toString('hex') + iv.toString('hex');
};

export function decrypt (hash:string) {
    let key = GetKey();     
    
    //split hash into iv and actual hash
    const bytes = Buffer.from(hash,'hex');
    const iv = bytes.slice(bytes.length-16,bytes.length);
    const hashed = bytes.slice(0,bytes.length-16);

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const decrpyted = Buffer.concat([decipher.update(hashed), decipher.final()]);

    return decrpyted.toString();
};

function GetKey(){
    if(pass != undefined){
        return crypto.scryptSync(pass, 'salt', 32);
    }else{
        console.warn("Using default pass!");
        return crypto.scryptSync(defaultPass, 'salt',32);
    } 
}