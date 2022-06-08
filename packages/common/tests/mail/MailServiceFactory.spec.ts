import { join } from "path";
import { expect } from "chai";
import "chai-as-promised";
import { when, mock, anything, instance, capture } from "ts-mockito";
import { describe, it } from "mocha";
import { createTransport, Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { MailServiceFactory } from "../../src/mail/MailServiceFactory";

describe("MailServiceFactory", mailServiceFactoryTest);

class CreateTransportMockClass {
    public createTransport(this: void,
        transport?: SMTPTransport | SMTPTransport.Options | string,
        defaults?: SMTPTransport.Options) {
        return createTransport(transport, defaults);
    }
}

function mailServiceFactoryTest() {
    it("Should load configuration from environment variable", () => {
        const input = {
            auth: {
                pass: "rafael",
                user: "rafael",
            },
            host: "smtp.example.com",
            port: 82898,
            secure: false,
        };

        const [createTransportMock, createTransportInstance]
            = mockCreateTransport(undefined);

        process.env.MAIL_CONFIG = JSON.stringify(input);

        new MailServiceFactory(createTransportInstance as typeof createTransport);

        delete process.env.MAIL_CONFIG;

        const [transportArgs] = capture(createTransportMock).last();

        expect(transportArgs).to.deep.equal(input);
    });


    it("Should allow loading configurations into a MailServiceProvider", async () => {
        const input = {
            auth: {
                pass: "rafael",
                user: "rafael",
            },
            host: "smtp.example.com",
            port: 82898,
            secure: false,
        };
        const transportMock = mock<Transporter>();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        when(transportMock.sendMail(anything())).thenResolve();

        const transportInstance = instance(transportMock);

        const [createTransportMock, createTransportInstance]
            = mockCreateTransport(transportInstance);

        process.env.MAIL_CONFIG = JSON.stringify(input);

        const factory = new MailServiceFactory(
            createTransportInstance as typeof createTransport);

        delete process.env.MAIL_CONFIG;

        const expected = {
            from: "info@example.com",
            subject: "johny",
            text: "is very cool person",
            to: "john@example.com"
        };

        const actual = factory.getProvider({
            from: "info@example.com"
        });
        await actual.sendText(expected.to, expected.subject, expected.text);

        // eslint-disable-next-line @typescript-eslint/unbound-method
        const [args] = capture(transportMock.sendMail).last();
        expect(args).to.deep.equal(expected);
    });

    it("Should throw when a non existing provider was retrieved", () => {
        const input = {
            auth: {
                pass: "rafael",
                user: "rafael",
            },
            host: "smtp.example.com",
            port: 82898,
            secure: false,
        };

        const [createTransportMock, createTransportInstance]
            = mockCreateTransport(undefined);

        process.env.MAIL_CONFIG = JSON.stringify(input);

        const factory = new MailServiceFactory(createTransportInstance as typeof createTransport);

        delete process.env.MAIL_CONFIG;

        expect(() => {
            factory.getProvider(undefined);
        }).to.throw(Error);
    });

    it("Should create a transporter", () => {
        const input = {
            auth: {
                pass: "rafael",
                user: "rafael",
            },
            host: "255.255.255.255",
            port: 82898,
            secure: false,
        };

        process.env.MAIL_CONFIG = JSON.stringify(input);

        const factory = new MailServiceFactory();

        delete process.env.MAIL_CONFIG;

        expect(factory.getTransporter()).not.to.equal(undefined);
    });

    it("Should throw if no configuration environment variables were specified", () => {
        expect(() => {
            new MailServiceFactory();
        }).to.throw(Error);
    });

    it("Should load configuration from a path", () => {
        const input = {
            auth: {
                pass: "rafael",
                user: "rafael",
            },
            host: "255.255.255.255",
            port: 82898,
            secure: false,
        };

        const [createTransportMock, createTransportInstance]
            = mockCreateTransport(undefined);

        process.env.MAIL_CONFIG_FILE = join(__dirname, "mailconfig.json");

        new MailServiceFactory(createTransportInstance as typeof createTransport);

        delete process.env.MAIL_CONFIG_FILE;

        const [transportArgs] = capture(createTransportMock).last();

        expect(transportArgs).to.deep.equal(input);
    });

    it("Should throw when a non existing path is provided", () => {
        process.env.MAIL_CONFIG_FILE = join(__dirname, "mailconfigsss.json");

        expect(() => {

            new MailServiceFactory(undefined);
        }).to.throw(Error);

        delete process.env.MAIL_CONFIG_FILE;
    });
}

function mockCreateTransport(transport?: Transporter<SMTPTransport.SentMessageInfo>) {
    const createTransportMock = mock(CreateTransportMockClass);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    when(createTransportMock.createTransport(anything())).thenReturn(transport);

    const createTransportInstance = instance(createTransportMock);

    return [createTransportMock.createTransport, createTransportInstance.createTransport];
}
