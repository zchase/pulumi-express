import { InlineProgramArgs, LocalWorkspace } from "@pulumi/pulumi/automation";
import { createAwsService } from "./program";

function logPulumiOutput(msg: string) {
    if (msg.split(" ").length > 2) {
        console.log(msg);
    }
}

export async function runPulumi() {
    // Create our stack
    const args: InlineProgramArgs = {
        stackName: "dev",
        projectName: "pulumi-express-demo",
        program: createAwsService,
    };

    // create (or select if one already exists) a stack that uses our inline program
    const stack = await LocalWorkspace.createOrSelectStack(args);

    console.info("successfully initialized stack");
    console.info("installing plugins...");
    await stack.workspace.installPlugin("aws", "v5.24.0");
    await stack.workspace.installPlugin("awsx", "v1.0.1");
    console.info("plugins installed");
    console.info("setting up config");
    await stack.setConfig("aws:region", { value: "us-west-2" });
    console.info("config set");

    console.info("refreshing stack...");
    await stack.refresh({ onOutput: logPulumiOutput });
    console.info("refresh complete");

    if (process.env.PULUMI_EXPRESS_INFRASTRUCTURE_PREVIEW) {
        console.info("previewing stack...");
        await stack.preview({ onOutput: logPulumiOutput });
        console.log("preview complete");
        return;
    }

    if (process.env.PULUMI_EXPRESS_INFRASTRUCTURE_DESTROY) {
        console.info("destroying stack...");
        await stack.destroy({ onOutput: logPulumiOutput });
        console.log("destroy complete");
        return;
    }

    console.info("updating stack...");
    await stack.up({ onOutput: logPulumiOutput });
    console.log("update complete");
}
