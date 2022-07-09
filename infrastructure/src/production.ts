import * as k8s from "@pulumi/kubernetes";
import { Secrets } from "./index";
import { Values } from "../charts/kurabuValues"
import { Input, Resource } from "@pulumi/pulumi";


export function deploy(outputs: string[], secrets: Secrets, dependsOn: Input<Resource> | Input<Input<Resource>[]>, isCertManaged: boolean) {
    var stagingDeployment = new k8s.helm.v3.Chart("staging", {
        path: "./charts/kurabu",
        values: {
            namespace: "staging",
            names: {
                db: {
                    persistentVolume: "db-persistent-volume-stage"
                }
            },
            labels: {
                db: {
                    persistentVolume: {
                        app: "db-persistent-volume-stage",
                        kind: "persistentVolume"
                    }
                }
            },
            storage: {
                db: {
                    volumeSettings: {
                        storageClassName: "standard",
                        volumeMode: "Filesystem",
                        accessModes: [
                            "ReadWriteOnce"
                        ],
                        hostPath: {
                            path: "/data/stage"
                        },
                        persistentVolumeReclaimPolicy: "Retain"
                    }
                }
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
            },
            ingress: {
                path: "/stage(/|$)(.*)",
                domain: "stage.kurabu.moe",
                tls: isCertManaged,
                tlsSecret: isCertManaged ? "kurabu-stage-tls" : undefined,
            }
        } as Values
    }, {
        dependsOn: dependsOn
    });

    outputs.push("staging", "api-deployment")

    var productionDeployment = new k8s.helm.v3.Chart("production", {
        path: "./charts/kurabu",
        values: {
            namespace: "production",
            replicaCounts: {
                api: 3
            },
            names: {
                db: {
                    persistentVolume: "db-persistent-volume-prod"
                }
            },
            labels: {
                db: {
                    persistentVolume: {
                        app: "db-persistent-volume-prod",
                        kind: "persistentVolume"
                    }
                }
            },
            storage: {
                db: {
                    volumeSettings: {
                        storageClassName: "standard",
                        volumeMode: "Filesystem",
                        accessModes: [
                            "ReadWriteOnce"
                        ],
                        hostPath: {
                            path: "/data/prod"
                        },
                        persistentVolumeReclaimPolicy: "Retain"
                    }
                }
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
            },
            ingress: {
                path: "/prod(/|$)(.*)",
                domain: "prod.kurabu.moe",
                tls: isCertManaged,
                tlsSecret: isCertManaged ? "kurabu-prod-tls" : undefined,
            }
        } as Values
    }, {
        dependsOn: dependsOn
    });

    outputs.push("production", "api-deployment")

    return [stagingDeployment, productionDeployment]
}
