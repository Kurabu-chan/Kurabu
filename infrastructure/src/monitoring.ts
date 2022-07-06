import * as k8s from "@pulumi/kubernetes";
import { Output } from "@pulumi/pulumi";
import { readFileSync } from "fs";
import { Secrets, Certificates } from ".";

export function addMonitoring(secrets: Secrets, ingress: k8s.helm.v3.Release, isCertManaged: boolean, certificates: Certificates) { 
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
    const prometheusIngressSettings: any = {
        enabled: true,
        ingressClassName: "nginx",
        paths: [
            "/"
        ],
        hosts: [
            "cluster.monitor.kurabu.moe"
        ]
    }

    if (isCertManaged) { 
        prometheusIngressSettings.tls = [
            {
                secretName: "grafana-tls",
                hosts: certificates["grafana-tls"].domains
            }
        ]
    }

    var prometheus = new k8s.helm.v3.Release("prometheus-monitoring", {
        chart: "kube-prometheus-stack",
        repositoryOpts: {
            repo: "https://prometheus-community.github.io/helm-charts"
        },
        values: {
            grafana: {
                ingress: prometheusIngressSettings,
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

    return [monitoringNamespace, prometheus];
}

export function addLogging(isProduction: boolean, ingress: k8s.helm.v3.Release, isCertManaged: boolean, certificates: Certificates) {
    const logstashConfig = readFileSync("./config/logstash.conf", "utf8");
    const logstashYaml = readFileSync("./config/logstash.yml", "utf8");
    let filebeatConfig = readFileSync("./config/filebeat.yml", "utf8");

    var loggingNamesapce = new k8s.core.v1.Namespace("logging", {
        kind: "Namespace",
        metadata: {
            name: "logging",
            labels: {
                app: "logging",
                kind: "namespace"
            }
        },
        apiVersion: "v1"
    });


    function addElasticSearch() {
        var elasticsearchResources: k8s.types.input.core.v1.ResourceRequirements = {
            requests: {
                cpu: "100m",
                memory: "1Gi"
            },
            limits: {
                cpu: "250m",
                memory: "2Gi"
            }
        }
    
        if (isProduction == false) {
            elasticsearchResources.requests = {
                cpu: "0m",
                memory: "0Gi"
            };
        }
    
        return new k8s.helm.v3.Release("elasticsearch", {
            chart: "elasticsearch",
            repositoryOpts: {
                repo: "https://helm.elastic.co"
            },
            values: {
                resources: elasticsearchResources,
                antiAffinity: "soft",
                replicas: 1,
                minimumMasterNodes: 1,
            },
            namespace: "logging"
        }, {
            dependsOn: [loggingNamesapce]
        });
    }

    function addLogstash(elasticsearch: k8s.helm.v3.Release) {
        return new k8s.helm.v3.Release("logstash", {
            chart: "logstash",
            repositoryOpts: {
                repo: "https://helm.elastic.co"
            },
            values: {
                logstashPipeline: {
                    "logstash.conf": logstashConfig
                },
                logstashConfig: {
                    "logstash.yml": logstashYaml
                },
                service: {
                    type: "ClusterIP",
                    ports: [
                        {
                            name: "beats",
                            port: 5044,
                            protocol: "TCP",
                            targetPort: 5044
                        },
                        {
                            name: "http",
                            port: 8080,
                            protocol: "TCP",
                            targetPort: 8080
                        }
                    ]
                }
            },
            namespace: "logging"
        }, {
            dependsOn: [elasticsearch, loggingNamesapce]
        });
    }

    function addFileBeat(logstash: k8s.helm.v3.Release) {
        
        const fullFilebeatConfig = logstash.id.apply((logstashId) => {
            //logstash-821d28c7-logstash
            const hostname = logstashId.split("/")[1] + "-logstash";

            return filebeatConfig.replace("logstash-logstash", hostname);

        });

        return new k8s.helm.v3.Release("filebeat", {
            chart: "filebeat",
            repositoryOpts: {
                repo: "https://helm.elastic.co"
            },
            values: {
                filebeatConfig: {
                    "filebeat.yml": fullFilebeatConfig
                }
            },
            namespace: "logging"
        }, {
            dependsOn: [logstash, loggingNamesapce]
        })
    }

    function addKibana(elasticsearch: k8s.helm.v3.Release) { 
        var kibanaResources: k8s.types.input.core.v1.ResourceRequirements = {
            requests: {
                cpu: "100m",
                memory: "1Gi"
            },
            limits: {
                cpu: "250m",
                memory: "2Gi"
            }
        }

        if (isProduction == false) {
            kibanaResources.requests = {
                cpu: "0m",
                memory: "0Gi"
            };
        }

        let kibanaIngressSettings: any = {
            enabled: true,
            className: "nginx",
            hosts: [
                {
                    host: "logs.monitor.kurabu.moe",
                    paths: [
                        {
                            path: "/"
                        }
                    ]
                }
            ]
        }

        if (isCertManaged) { 
            kibanaIngressSettings.tls = [
                {
                    secretName: "kibana-tls",
                    hosts: certificates["kibana-tls"].domains
                }
            ]
        }

        return new k8s.helm.v3.Release("kibana", {
            chart: "kibana",
            repositoryOpts: {
                repo: "https://helm.elastic.co"
            },
            values: {
                ingress: kibanaIngressSettings,
                resources: kibanaResources
            },
            namespace: "logging"
        }, {
            dependsOn: [ingress, elasticsearch, loggingNamesapce]
        });
    }

    const elasticsearch = addElasticSearch();

    const logstash = addLogstash(elasticsearch);

    const filebeat = addFileBeat(logstash);

    const kibana = addKibana(elasticsearch);

    return [elasticsearch, logstash, filebeat, kibana];
}

export function addDatabaseMonitoring(isProduction: boolean, secrets: Secrets, ingress: k8s.helm.v3.Release, isCertManaged: boolean, certificates: Certificates) { 
    type Server = {
        Name: string | Output<string>,
        Group: string | Output<string>,
        Port: number | Output<number>,
        Username: string | Output<string>,
        Host: string | Output<string>,
        SSLMode: string | Output<string>,
        MaintenanceDB: string | Output<string>
    }

    let servers: Record<string, Server> = {}

    if (isProduction) {
        servers["production"] = {
            Name: "production",
            Group: "Servers",
            Port: 5432,
            Username: secrets["db.user"],
            Host: "db-service.production",
            SSLMode: "prefer",
            MaintenanceDB: secrets["db.database"]
        }

        servers["staging"] = {
            Name: "staging",
            Group: "Servers",
            Port: 5432,
            Username: secrets["db.user"],
            Host: "db-service.staging",
            SSLMode: "prefer",
            MaintenanceDB: secrets["db.database"]
        }
    } else {
        servers["development"] = {
            Name: "development",
            Group: "Servers",
            Port: 5432,
            Username: secrets["db.user"],
            Host: "db-service.dev",
            SSLMode: "prefer",
            MaintenanceDB: secrets["db.database"]
        }
    }

    var databaseMonitoring = new k8s.core.v1.Namespace("db-monitoring", {
        kind: "Namespace",
        metadata: {
            name: "db-monitoring",
            labels: {
                app: "db-monitoring",
                kind: "namespace"
            }
        },
        apiVersion: "v1"
    });
    
    let pgAdminIngressSettings: any = {
        enabled: true,
        ingressClassName: "nginx",
        hosts: [
            {
                host: "database.monitor.kurabu.moe",
                paths: [
                    {
                        path: "/",
                        pathType: "Prefix"
                    }
                ]
            }
        ]
    }
    
    if (isCertManaged) { 
        pgAdminIngressSettings.tls = [
            {
                secretName: "pgadmin-tls",
                hosts: certificates["pgadmin-tls"].domains
            }
        ]
    }

    var pgadmin = new k8s.helm.v3.Release("pg-admin", {
        chart: "pgadmin4",
        repositoryOpts: {
            repo: "https://helm.runix.net"
        },
        values: {
            serverDefinitions: {
                enabled: true,
                servers: servers
            },
            ingress: pgAdminIngressSettings,
            env: {
                email: secrets["databaseMonitorEmail"],
                password: secrets["databaseMonitorPassword"]
            }
        },
        namespace: "db-monitoring"
    }, {
        dependsOn: [databaseMonitoring, ingress]
    });
}
