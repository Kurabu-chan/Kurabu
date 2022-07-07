import * as k8s from "@pulumi/kubernetes";
import { Output, Config } from "@pulumi/pulumi";
import { deploy as productionDeploy } from "./production";
import { deploy as developmentDeploy } from "./development";
import { addDatabaseMonitoring, addLogging, addMonitoring } from "./monitoring";
import { addSSL } from "./ssl";

const outputs: string[] = []

var config = new Config();
var isProduction = config.getBoolean("production") ?? process.env.NODE_ENV === "production";

var isCertManaged = isProduction;

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
    "databaseMonitorEmail": Output<string>,
    "databaseMonitorPassword": Output<string>,
    "kibanaMonitorUser": Output<string>,
    "kibanaMonitorPassword": Output<string>,
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
    "grafanaPassword": config.requireSecret("grafanaPassword"),
    "databaseMonitorEmail": config.requireSecret("databaseMonitorEmail"),
    "databaseMonitorPassword": config.requireSecret("databaseMonitorPassword"),
    "kibanaMonitorUser": config.requireSecret("kibanaMonitorUser"),
    "kibanaMonitorPassword": config.requireSecret("kibanaMonitorPassword")
}

console.log(`Deploying to ${isProduction ? "production" : "development"}`)

var ingress = new k8s.helm.v3.Release("nginx-ingress", {
    chart: "ingress-nginx",
    repositoryOpts: {
        repo: "https://kubernetes.github.io/ingress-nginx",
    }
});

type Certificate = {
    domains: string[],
    namespace: string | Output<string>,
    dependsOn?: k8s.helm.v3.Chart[]
}

export type Certificates = Record<string, Certificate>;

const certificates: Record<string, Certificate> = {
    "kibana-tls": {
        namespace: "logging",
        domains: [
            "logs.monitor.kurabu.moe"
        ]
    },
    "grafana-tls": {
        namespace: "default",
        domains: [
            "cluster.monitor.kurabu.moe"
        ]
    },
    "pgadmin-tls": {
        namespace: "db-monitoring",
        domains: [
            "database.monitor.kurabu.moe"
        ]
    }
}

const monitoring = addMonitoring(secrets, ingress, isCertManaged, certificates);
const logging = addLogging(isProduction, ingress, isCertManaged, certificates, secrets);
const dabaseMonitoring = addDatabaseMonitoring(isProduction, secrets, ingress, isCertManaged, certificates);

if (isProduction) {
    const prodResources = productionDeploy(outputs, secrets, [ingress, ...monitoring, ...logging], isCertManaged);

    certificates["kurabu-prod-tls"] = {
        namespace: "production",
        domains: [
            "prod.kurabu.moe"
        ],
        dependsOn: prodResources
    };
    certificates["kurabu-stage-tls"] = {
        namespace: "staging",
        domains: [
            "stage.kurabu.moe"
        ],
        dependsOn: prodResources
    };
} else {
    developmentDeploy(outputs, secrets, [ingress, ...monitoring, ...logging]);
}

if (isCertManaged) {
    addSSL(ingress, certificates);
}


export {
    outputs
}
