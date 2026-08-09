class CommandDispatcher {

    constructor() {

        this.commands = new Map();

    }

    async dispatch(argv) {

        console.log("DevKit initialized.");
        console.log("");

        console.log("Arguments:");

        argv.forEach((arg, index) => {

            console.log(`${index}: ${arg}`);

        });

        console.log("");
        console.log("Dispatcher ready.");

    }

}

export default CommandDispatcher;