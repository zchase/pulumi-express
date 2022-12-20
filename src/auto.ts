import { InlineProgramArgs, LocalWorkspace } from "@pulumi/pulumi/automation";
import { createAwsService } from "./program";

export async function runPulumi() {
    // Create our stack
    const args: InlineProgramArgs = {
        stackName: "dev",
        projectName: "inlineNode",
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
    await stack.refresh({ onOutput: console.info });
    console.info("refresh complete");

    if (process.env.PULUMI_EXPRESS_INFRASTRUCTURE_DESTROY) {
        console.info("destroying stack...");
        await stack.destroy({ onOutput: console.info });
        console.log("destroy complete");
        return;
    }

    console.info("updating stack...");
    await stack.up({ onOutput: console.info });
    console.log("update complete");
}
