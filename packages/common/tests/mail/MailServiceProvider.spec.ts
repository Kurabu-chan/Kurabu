import { expect } from "chai";
import "chai-as-promised";
import { describe, it } from "mocha";
import { Transporter } from "nodemailer";
import { mock, when, anything, instance, verify, capture } from "ts-mockito";
import { MailServiceProvider } from "../../src/mail/MailServiceProvider";

describe("MailServiceProvider", mailServiceProviderTest);

function mailServiceProviderTest() {

    it("Should call sendMail once on the provided transporter", async () => {
        const transporterMock = mock<Transporter>();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        when(transporterMock.sendMail(anything())).thenResolve();

        const transporter = instance(transporterMock);

        const provider = new MailServiceProvider(transporter, {
            from: "info@example.com"
        });

        await provider.sendText("john@example.com", "johny", "is very cool person");

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        verify(transporterMock.sendMail(anything())).once();

        await provider.sendHtml("john@example.com", "johny", "is very cool person");

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        verify(transporterMock.sendMail(anything())).twice();
    });

    it("Should call sendMail with the correct configuration", async () => {

        const transporterMock = mock<Transporter>();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        when(transporterMock.sendMail(anything())).thenResolve();

        const transporter = instance(transporterMock);


        const expectedText = {
            from: "info@example.com",
            subject: "johny",
            text: "is very cool person",
            to: "john@example.com"
        };

        const expectedHtml = {
            from: "info@example.com",
            html: "is very cool person",
            subject: "johny",
            text: "is very cool person two",
            to: "john@example.com",
        };

        const provider = new MailServiceProvider(transporter, {
            from: expectedText.from
        });

        await provider.sendText(expectedText.to, expectedText.subject, expectedText.text);

        // eslint-disable-next-line @typescript-eslint/unbound-method
        const [argText] = capture(transporterMock.sendMail).last();

        expect(argText).to.deep.equal(expectedText);

        await provider.sendHtml(
            expectedHtml.to,
            expectedHtml.subject,
            expectedHtml.html,
            expectedHtml.text
        );

        // eslint-disable-next-line @typescript-eslint/unbound-method
        const [argHtml] = capture(transporterMock.sendMail).last();
        expect(argHtml).to.deep.equal(expectedHtml);
    });
}
