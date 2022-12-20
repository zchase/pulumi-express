import express from "express";
import pulumiExpress from "./src";

export default function init(): express.Express {
    if (process.env.PULUMI_EXPRESS_INFRASTRUCTURE_DEPLOY || process.env.PULUMI_EXPRESS_INFRASTRUCTURE_DESTROY) {
        return pulumiExpress();
    }

    return express();
};
