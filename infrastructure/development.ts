import * as k8s from "@pulumi/kubernetes";
import { Secrets } from "./index";
import { Values } from "./charts/kurabuValues"
import { interpolate } from "@pulumi/pulumi"


export function deploy(outputs: string[], secrets: Secrets) {
    var devDeployment = new k8s.helm.v3.Chart("dev", {
        path: "./charts/kurabu",
        values: {
            namespace: "dev",
            secrets: {
                api: {
                    values: {
                        clientId: secrets["api.clientId"],
                        clientSecret: secrets["api.clientSecret"],
                        passwordEncryptionKey: secrets["api.passwordEncryptionKey"],
                        jwtEncryptionCertificate: secrets["api.jwtEncryptionCertificate"],
                        databaseUrl: secrets["api.databaseUrl"],
                        sendgridApiKey: secrets["api.sendgridApiKey"],
                        migrationPath: secrets["api.migrationPath"],
                        emailDomain: secrets["api.emailDomain"],
                        databaseSSL: secrets["api.databaseSSL"],
                    }
                },
                db: {
                    values: {
                        database: secrets["db.database"],
                        password: secrets["db.password"],
                        user: secrets["db.user"]
                    }
                }
            },
            ingress: {
                tls: false
            }
        } as Values
    });

    outputs.push("dev", "api-deployment")
    
}
