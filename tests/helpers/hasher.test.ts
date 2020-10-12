import { doesNotMatch } from 'assert';
import {expect} from 'chai';
import { resolve } from 'path';
import {hash,Verify} from '../../src/helpers/Hasher';
import {getPKCE} from '../../src/helpers/randomCodes';

describe('Hash tests', ()=> {
    it("Hashing then verifying should return true", async () => {
        //TODO change runs when hashing has been edited to be faster
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
    })
})