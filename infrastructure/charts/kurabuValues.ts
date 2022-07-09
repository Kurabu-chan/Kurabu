import { Output } from "@pulumi/pulumi";

export type Values = {
    namespace?: string,
    ports?: {
        api?: number,
        db?: number
    },
    resources?: {
        api?: Resources;
        db?: Resources;
    },
    replicaCounts?: {
        api?: number
    },
    storage?: {
        db?: {
            size?: `${number}${"M"|"G"|"T"}i`;
            volumeClaimSettings?: {
                storageClassName?: string;
                accessModes?: AccessMode[];
            };
            volumeSettings?: {
                storageClassName?: string;
                volumeMode?: VolumeMode;
                accessModes?: AccessMode[];
                hostPath?: {
                    path?: string;
                };
                persistentVolumeReclaimPolicy?: ReclaimPolicy;
            };
        };
    },
    serviceTypes?: {
        api?: string;
        db?: string;
    },
    ingress?: {
        tls?: boolean,
        tlsSecret?: string,
        name?: string,
        path?: string,
        domain?: string
    },
    names?: {
        api?: {
            service?: string;
            deployment?: string;
            container?: string;
            host_ingress?: string;
            path_ingress?: string;
        },
        db?: {
            service?: string;
            pod?: string;
            container?: string;
            volume?: string;
            persistentVolumeClaim?: string;
            persistentVolume?: string;
        },
    },
    labels?: {
        namespace?: LabelSpec,
        api?: {
            deployment?: LabelSpec,
            deployment_pod?: LabelSpec,
            service?: LabelSpec,
            host_ingress?: LabelSpec,
            path_ingress?: LabelSpec
        },
        db?: {
            service?: LabelSpec,
            pod?: LabelSpec,
            container?: LabelSpec,
            persistentVolumeClaim?: LabelSpec,
            persistentVolume?: LabelSpec
        }
    },
    images?: {
        api?: ImageSpec,
        db?: ImageSpec
    },
    secrets: {
        api: {
            secretName?: string,
            /** Only set the key name not the actual value */
            keys?: {
                clientId?: string,
                clientSecret?: string,
                passwordEncryptionKey?: string,
                jwtEncryptionCertificate?: string,
                databaseUrl?: string,
                sendgridApiKey?: string,
                migrationPath?: string,
                emailDomain?: string,
                databaseSSL?: string,
            },
            values: {
                clientId: Output<string>,
                clientSecret: Output<string>,
                passwordEncryptionKey: Output<string>,
                jwtEncryptionCertificate: Output<string>,
                databaseUrl: Output<string>,
                sendgridApiKey: Output<string>,
                migrationPath: Output<string>,
                emailDomain: Output<string>,
                databaseSSL: Output<string>,
            };
        };
        db: {
            secretName?: string,
            /** Only set the key name not the actual value */
            keys?: {
                password?: string,
                user?: string,
                database?: string
            },
            values: {
                password: Output<string>,
                user: Output<string>,
                database: Output<string>
            }
        };
    }
}

type VolumeMode = "Filesystem" | "Block";

type ReclaimPolicy = "Retain" | "Recycle" | "Delete";

type AccessMode = "ReadWriteOnce" | "ReadOnlyMany" | "ReadWriteMany" | "ReadWriteOncePod";

type ImageSpec = {
    imageName?: string;
    imagePullPolicy?: string;
}

type LabelSpec = Record<string, string>;

type Resources = {
    requests?: {
        memory?: string;
        cpu?: string;
    },
    limits?: {
        memory?: string;
        cpu?: string;
    },
}
