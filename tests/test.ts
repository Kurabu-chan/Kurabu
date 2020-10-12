import {isUUID} from '../src/helpers/randomCodes';
import {expect} from 'chai';

describe('Random Codes tests', () => {
    it('Should return true on valid lower case uuid', () => {
        const uuid = "550e8400-e29b-41d4-a716-446655440000";
        expect(isUUID(uuid)).to.equal(true);
    })
});