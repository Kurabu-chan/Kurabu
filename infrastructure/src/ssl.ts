import { Input, Resource } from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";
import { Certificates } from ".";

export function addSSL(ingress: k8s.helm.v3.Release, certificates: Certificates) { 
    var certManagerNamespace = new k8s.core.v1.Namespace("cert-manager", {
        kind: "Namespace",
        metadata: {
            name: "cert-manager",
            labels: {
                app: "cert-manager",
                kind: "namespace"
            }
        },
        apiVersion: "v1"
    });


    var certManager = new k8s.helm.v3.Release("cert-manager", {
        chart: "cert-manager",
        repositoryOpts: {
            repo: "https://charts.jetstack.io"
        },
        values: {
            installCRDs: true
        },
        namespace: certManagerNamespace.metadata.name
    }, {
        dependsOn: [certManagerNamespace]
    })

    var clusterIssuer = new k8s.apiextensions.CustomResource("letsencrypt", {
        apiVersion: "cert-manager.io/v1",
        kind: "ClusterIssuer",
        metadata: {
            name: "letsencrypt",
        },
        spec: {
            acme: {

                // server: "https://acme-v02.api.letsencrypt.org/directory",
                skipTLSVerify: true,
                server: "https://pebble:14000/dir",
                email: "rafael@rafaeltab.com",
                privateKeySecretRef: {
                    name: "issuer-account-key",
                },
                solvers: [
                    {
                        http01: {
                            ingress: {
                                class: "nginx",
                            }
                        }
                    }
                ]
            }
        }
    }, {
        dependsOn: [certManager, ingress]
    });


    for (const [certificateName, certificate] of Object.entries(certificates)) {
        var cert = new k8s.apiextensions.CustomResource("certificate-" + certificateName, {
            apiVersion: "cert-manager.io/v1",
            kind: "Certificate",
            metadata: {
                name: certificateName,
                namespace: certificate.namespace,
            },
            spec: {
                dnsNames: certificate.domains,
                issuerRef: {
                    kind: "ClusterIssuer",
                    name: clusterIssuer.metadata.name,
                },
                secretName: certificateName,
            }
        }, {
            dependsOn: [clusterIssuer, ...(certificate.dependsOn ?? [])]
        })
    }
}
