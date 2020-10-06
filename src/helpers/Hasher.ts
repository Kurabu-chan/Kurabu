import * as crypto from 'crypto';

const digest = 'sha512';
const iters = 99999;
const keyLength = 1024;

/** Hash a password */
export async function hash(password: string):Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            let salt = crypto.randomBytes(keyLength);
            let key = crypto.pbkdf2Sync(password, salt, iters, keyLength, digest);
            
            var buffer = Buffer.alloc(keyLength * 2);            

            salt.copy(buffer);
            key.copy(buffer, salt.length);
    
            resolve(buffer.toString('base64'));
        } catch (e) {
            reject(e);
        }
    });
}

/** Compare a password to a hash and see if they the same */
export async function Verify(password: string, hash: string) : Promise<boolean>{
    return new Promise((resolve, reject) => {
        var buff = Buffer.alloc(keyLength*2,hash, 'base64');
        var salt = buff.slice(0, keyLength);
        var keyA = buff.slice(keyLength, keyLength * 2);

        let keyB = crypto.pbkdf2Sync(password, salt, iters, keyLength, digest);

        resolve(keyA.compare(keyB) == 0);
    });
}
