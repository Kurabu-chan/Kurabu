import {expect} from 'chai';
import {hash,Verify, encrypt, decrypt} from '../../src/helpers/Hasher';
import {getPKCE} from '../../src/helpers/randomCodes';

describe('Hash tests', ()=> {
    it("Hashing then verifying should return true", async () => {
        let allNonHashed : string[] = [];
        let allHashedPromise : Promise<string>[] = [];
        for(let i =0; i < 1; i++){
            let nonhashed = getPKCE(100);
            allNonHashed.push(nonhashed)
            allHashedPromise.push(hash(nonhashed));
        }
        let allHashed = await Promise.all(allHashedPromise);

        let allVerifyPromise : Promise<boolean>[] = [];
        allHashed.forEach((hash, index) => {
            allVerifyPromise.push(Verify(allNonHashed[index],hash));
        });
        let allVerify = await Promise.all(allVerifyPromise);
        allVerify.forEach((verify)=>{
            expect(verify).to.equal(true);
        });
    });

    it("Hashing then verifying an old hash (99999 iters) should return true", async () => {
        let nonhashed = getPKCE(100);
        let hashed = await hash(nonhashed, 99999);
        let verified = await Verify(nonhashed, hashed)
       
        expect(verified).to.equal(true);
    });

    it("Encrypting then decrypting a string should return the same as the starting string", async() => {
        let password = "hey thats very cool";
        let encrypted = encrypt(password);
        let decrypted = decrypt(encrypted);

        expect(password).to.equal(decrypted);
    });
});