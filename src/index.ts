import express from "express";
import { runPulumi } from "./auto";

export default function init(): express.Express {
    const app = express();

    // @ts-ignore
    app.listen = () => {
        console.log("hijacked express");

        runPulumi()
            .then(() => {
                console.log ("pulumi has finished");
            })
            .catch((e) => {
                console.log("pulumi error", e);
                process.exit(1);
            });
    };

    return app;
}
