import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

export async function createAwsService() {
    const config = new pulumi.Config();
    const containerPort = config.getNumber("containerPort") || 3000;
    const cpu = config.getNumber("cpu") || 512;
    const memory = config.getNumber("memory") || 128;

    // An ECS cluster to deploy into
    const cluster = new aws.ecs.Cluster("cluster", {});

    // An ALB to serve the container endpoint to the internet
    const loadbalancer = new awsx.lb.ApplicationLoadBalancer("loadbalancer", {
        listener: {
            port: containerPort,
        },
    });

    // An ECR repository to store our application's container image
    const repo = new awsx.ecr.Repository("repo", {});

    // Build and publish our application's container image from ./app to the ECR repository
    const image = new awsx.ecr.Image("image", {
        repositoryUrl: repo.url,
        path: process.cwd(),
    });

    // Deploy an ECS Service on Fargate to host the application container
    const service = new awsx.ecs.FargateService("service", {
        cluster: cluster.arn,
        assignPublicIp: true,
        taskDefinitionArgs: {
            container: {
                image: image.imageUri,
                cpu: cpu,
                memory: memory,
                essential: true,
                portMappings: [{
                    targetGroup: loadbalancer.defaultTargetGroup,
                }],
            },
        },
    });

    return {
        url: pulumi.interpolate`http://${loadbalancer.loadBalancer.dnsName}`,
    };
}
