import * as k8s from "@pulumi/kubernetes";
import { Secrets } from "./index";
import { Values } from "./charts/kurabuValues"


export function deploy(outputs: string[], secrets: Secrets) {
    // create cert manager


    var stagingDeployment = new k8s.helm.v3.Chart("staging", {
        path: "./charts/kurabu",
        values: {
            namespace: "staging",
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
            }
        } as Values
    });

    outputs.push("staging", "api-deployment")

    var productionDeployment = new k8s.helm.v3.Chart("production", {
        path: "./charts/kurabu",
        values: {
            namespace: "production",
            replicaCounts: {
                api: 3
            },
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
            }
        } as Values
    });

    outputs.push("production", "api-deployment")

}
