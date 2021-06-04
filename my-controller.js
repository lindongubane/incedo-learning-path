const PouchDB = require('pouchdb');
const database = new PouchDB('controllerDb');
const myArgs = process.argv.slice(2);

switch (myArgs[0]) {
    case "list":
        listController().catch(console.error);
        break;
    case "add":
        addController(myArgs[1], myArgs[2]).catch(console.error);
        break;
    case "remove":
        removeController(myArgs[1]).catch(console.error);
        break;
}

async function addController(serial, mac) {
    const {total_rows} = await database.allDocs({include_docs: true});
    const controller = {
        _id: `${total_rows + 1}`,
        serialNumber: serial,
        macAddress: mac
    };

    database.put(controller, (err, res) => {
        if (!err) {
            console.info("Controller added");
        } else {
            console.error("something went wrong")
            console.error(err);
        }
    });
}

async function removeController(macAddress) {
    let {rows: controllers} = await database.allDocs({include_docs: true});

    controllers = controllers.map(controller => {
        return {
            _id: controller.doc._id,
            _rev : controller.doc._rev,
            serialNumber: controller.doc.serialNumber,
            macAddress: controller.doc.macAddress
        }
    });

    database.remove(controllers.find(indent => indent.macAddress === macAddress));
    console.info("controller removed");
}

async function listController() {
    let {rows: controllers} = await database.allDocs({include_docs: true});
    controllers = controllers.map(controller => {
        return {
            serialNumber: controller.doc.serialNumber,
            macAddress: controller.doc.macAddress
        }
    });
    console.table( controllers);
    return controllers;
}
