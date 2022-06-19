import * as k8s from "@pulumi/kubernetes";
import { Output, Config } from "@pulumi/pulumi";
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
    "grafanaPassword": Output<string>,
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
    "grafanaPassword": config.requireSecret("grafanaPassword")
}

console.log(`Deploying to ${isProduction? "production" : "development"}`)

var monitoringNamespace = new k8s.core.v1.Namespace("monitoring", {
    kind: "Namespace",
    metadata: {
        name: "monitoring",
        labels: {
            app: "monitoring",
            kind: "namespace"
        }
    },
    apiVersion: "v1"
});

var ingress = new k8s.helm.v3.Release("nginx-ingress", {
    chart: "ingress-nginx",
    repositoryOpts: {
        repo: "https://kubernetes.github.io/ingress-nginx",
    }
});

var prometheus = new k8s.helm.v3.Release("prometheus-monitoring", {
    chart: "kube-prometheus-stack",
    repositoryOpts: {
        repo: "https://prometheus-community.github.io/helm-charts"
    },
    values: {
        grafana: {
            ingress: {
                enabled: true,
                ingressClassName: "nginx",
                paths: [
                    "/"
                ],
                hosts: [
                    "monitor.kurabu.moe"
                ]
            },
            adminPassword: secrets.grafanaPassword
        },
        namespaceOverride: "monitoring",
        "prometheus-node-exporter": {
            hostRootFsMount: {
                enabled: false
            }
        }
    }
}, {
    dependsOn: [monitoringNamespace, ingress]
})

if (isProduction) {
    productionDeploy(outputs, secrets, [ingress]);
} else {
    developmentDeploy(outputs, secrets, [ingress]);
}

export {
    outputs
}
