import * as k8s from "@pulumi/kubernetes";
import { Namespace } from "@pulumi/kubernetes/core/v1";
import * as kx from "@pulumi/kubernetesx";
import { Output, Config } from "@pulumi/pulumi";
import { Values } from "./charts/kurabuValues"
import { deploy as productionDeploy } from "./production";
import { deploy as developmentDeploy } from "./development";

const outputs: string[] = []

var config = new Config();
var isProduction = config.getBoolean("production") ?? process.env.NODE_ENV === "production";

export type Secrets = {
    "api.clientId": Output<string>,
    "api.clientSecret": Output<string>,
    "api.passwordEncryptionKey": Output<string>,
    "api.jwtEncryptionCertificate": Output<string>,
    "api.databaseUrl": Output<string>,
    "api.sendgridApiKey": Output<string>,
    "api.migrationPath": Output<string>,
    "api.emailDomain": Output<string>,
    "api.databaseSSL": Output<string>,
    "db.database": Output<string>,
    "db.password": Output<string>,
    "db.user": Output<string>,
}

const secrets: Secrets = {
    "api.clientId": config.requireSecret("api.clientId"),
    "api.clientSecret": config.requireSecret("api.clientSecret"),
    "api.passwordEncryptionKey": config.requireSecret("api.passwordEncryptionKey"),
    "api.jwtEncryptionCertificate": config.requireSecret("api.jwtEncryptionCertificate"),
    "api.databaseUrl": config.requireSecret("api.databaseUrl"),
    "api.sendgridApiKey": config.requireSecret("api.sendgridApiKey"),
    "api.migrationPath": config.requireSecret("api.migrationPath"),
    "api.emailDomain": config.requireSecret("api.emailDomain"),
    "api.databaseSSL": config.requireSecret("api.databaseSSL"),
    "db.database": config.requireSecret("db.database"),
    "db.password": config.requireSecret("db.password"),
    "db.user": config.requireSecret("db.user"),
}

console.log(`Deploying to ${isProduction? "production" : "development"}`)

// create ingress controller
var ingress = new k8s.helm.v3.Chart("nginx-ingress", {
    chart: "ingress-nginx",
    fetchOpts: {
        repo: "https://kubernetes.github.io/ingress-nginx",
    }
});

if (isProduction) {
    productionDeploy(outputs, secrets);
} else {
    developmentDeploy(outputs, secrets);
}

export {
    outputs
}
