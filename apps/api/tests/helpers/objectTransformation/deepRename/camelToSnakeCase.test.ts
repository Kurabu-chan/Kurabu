import { expect } from "chai";
import { CamelToSnakeCase } from "#helpers/objectTransormation/deepRename/camelToSnakeCase";

export function camelToSnakeCase(): void {
    const converter = new CamelToSnakeCase();

    describe("Camel To Snake Case", () => {
        it("Should convert a single string to snake case from camel case", () => {
            const mappings = [
                {
                    camelCase: "camelCase",
                    snakeCase: "camel_case"
                },
                {
                    camelCase: "loremIpsumDolorSitAmet",
                    snakeCase: "lorem_ipsum_dolor_sit_amet"
                },
                {
                    camelCase: "consecteturAdipisicingElit",
                    snakeCase: "consectetur_adipisicing_elit"
                },
                {
                    camelCase: "maximeMollitia",
                    snakeCase: "maxime_mollitia"
                },
                {
                    camelCase: "molestiaeQuasVel",
                    snakeCase: "molestiae_quas_vel"
                },
                {
                    camelCase: "sintCommodiRepudiandae",
                    snakeCase: "sint_commodi_repudiandae"
                },
                {
                    camelCase: "consequunturVoluptatumLaborum",
                    snakeCase: "consequuntur_voluptatum_laborum"
                },
                {
                    camelCase: "numquamBlanditiis",
                    snakeCase: "numquam_blanditiis"
                },
                {
                    camelCase: "harumQuisquamEiusSedOdit",
                    snakeCase: "harum_quisquam_eius_sed_odit"
                },
                {
                    camelCase: "fugiatIustoFugaPraesentium",
                    snakeCase: "fugiat_iusto_fuga_praesentium"
                },
                {
                    camelCase: "optioEaqueRerum",
                    snakeCase: "optio_eaque_rerum"
                }
            ];

            for (const mapping of mappings) {
                expect(converter.single(mapping.camelCase)).to.equal(mapping.snakeCase);
            }
        });

        it("Should convert a single layered object to snake case from camel case", () => {
            const input = {
                helloHowAreYou: "hi",
                iAmGoodThanks: "great"
            };

            const expected = {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                hello_how_are_you: "hi",
                // eslint-disable-next-line @typescript-eslint/naming-convention
                i_am_good_thanks: "great"
            };

            expect(JSON.stringify(converter.fullObject(input), null, 2))
                .to.equal(JSON.stringify(expected, null, 2));
        });

        it("Should convert a multi layered object to snake case from camel case", () => {
            const input = {
                helloHowAreYou: {
                    iAmGoodThanks: "great"
                }
            };

            const expected = {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                hello_how_are_you: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    i_am_good_thanks: "great"
                },
            };

            expect(JSON.stringify(converter.fullObject(input), null, 2))
                .to.equal(JSON.stringify(expected, null, 2));
        });

        it("Should convert a objects inside of an array to snake case from camel case", () => {
            const input = [
                {
                    helloHowAreYou: "hi",
                    iAmGoodThanks: "great"
                },
                {
                    helloHowAreYou: "hi",
                    iAmGoodThanks: "great"
                }
            ];

            const expected = [
                {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    hello_how_are_you: "hi",
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    i_am_good_thanks: "great"
                },
                {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    hello_how_are_you: "hi",
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    i_am_good_thanks: "great"
                }
            ];

            expect(JSON.stringify(converter.fullObject(input), null, 2))
                .to.equal(JSON.stringify(expected, null, 2));
        });
    });
}
