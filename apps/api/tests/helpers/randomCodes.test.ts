import { expect } from "chai";
import { isUUID, getUUID, getPKCE, makeVerifCode } from "#helpers/randomCodes";

export function randomCodes(): void {
    describe("Random Codes", () => {
        describe("UUID", () => {
            it("isUUID Should return true on valid lower case uuid", () => {
                const uuid = "550e8400-e29b-41d4-a716-446655440000".toLowerCase();
                expect(isUUID(uuid)).to.equal(true);
            });
            it("isUUID Should return true on valid upper case uuid", () => {
                const uuid = "550e8400-e29b-41d4-a716-446655440000".toUpperCase();
                expect(isUUID(uuid)).to.equal(true);
            });
            it("isUUID Should return false on invalid lower case uuid", () => {
                const uuid = "550e8400-e29b-41d4-a716-446655440000s";
                expect(isUUID(uuid)).to.equal(false);
            });
            it("isUUID Should return false on invalid upper case uuid", () => {
                const uuid = "550e8400-e29b-41d4-a716-446655440000s".toUpperCase();
                expect(isUUID(uuid)).to.equal(false);
            });

            it("getUUID Should return valid lower case uuid", () => {
                const uuid = getUUID();
                expect(isUUID(uuid)).to.equal(true);
            });
        });

        describe("Other", () => {
            it("getPKCE Should return code with length within 2 away from given length", () => {
                for (let i = 0; i < 100; i++) {
                    const length = Math.floor(Math.random() * 100 + 1);

                    const pkce = getPKCE(length);
                    expect(pkce.length).to.be.greaterThan(length - 2);
                    expect(pkce.length).to.be.lessThan(length + 2);
                }
            });
            it("getPKCE Should return url valid code", () => {
                const pkce = getPKCE(4827);
                const encoded = encodeURI(pkce);
                expect(encoded).to.equal(pkce);
            });

            it("makeVerifCode should return a 6 character string", () => {
                for (let i = 0; i < 100; i++) {
                    expect(makeVerifCode().length).to.equal(6);
                }
            });
            it("makeVerifCode should return only digits", () => {
                for (let i = 0; i < 100; i++) {
                    expect(/^\D{6}$/.exec(makeVerifCode()) == null).to.equal(true);
                }
            });
            it("makeVerifCode should return different code everytime", () => {
                const codes: string[] = [];
                for (let i = 0; i < 100; i++) {
                    codes.push(makeVerifCode());
                }
                expect(hasDuplicates(codes)).to.equal(false);
            });
            it("makeVerifCode should make every digit just as likely as all others", () => {
                let str = "";
                const runs = 100000;
                for (let i = 0; i < runs; i++) {
                    str += makeVerifCode();
                }
                const counts: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                for (let i = 0; i < str.length; i++) {
                    counts[parseInt(str.charAt(i), 10)]++;
                }

                let avr = 0;
                counts.forEach((x) => (avr += x));
                avr /= counts.length;
                const range = runs / 70;

                counts.forEach((x, i) => {
                    // eslint-disable-next-line max-len
                    const msg = `nr ${i} was overrepresented, the average count for a digit was ${avr} but this number occured ${x} times`;
                    expect(x + range > avr && x - range < avr).to.equal(true, msg);
                });
            });
        });
    });
}

function hasDuplicates(array: any[]) {
    return new Set(array).size !== array.length;
}
