const express = require('express');
const appService = require('./appService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

// router.get('/demotable', async (req, res) => {
//     const tableContent = await appService.fetchDemotableFromDb();
//     res.json({data: tableContent});
// });

// router.post("/initiate-demotable", async (req, res) => {
//     const initiateResult = await appService.initiateDemotable();
//     if (initiateResult) {
//         res.json({ success: true });
//     } else {
//         res.status(500).json({ success: false });
//     }
// });

// router.post("/insert-demotable", async (req, res) => {
//     const { id, name } = req.body;
//     const insertResult = await appService.insertDemotable(id, name);
//     if (insertResult) {
//         res.json({ success: true });
//     } else {
//         res.status(500).json({ success: false });
//     }
// });

// router.post("/update-name-demotable", async (req, res) => {
//     const { oldName, newName } = req.body;
//     const updateResult = await appService.updateNameDemotable(oldName, newName);
//     if (updateResult) {
//         res.json({ success: true });
//     } else {
//         res.status(500).json({ success: false });
//     }
// });

// router.get('/count-demotable', async (req, res) => {
//     const tableCount = await appService.countDemotable();
//     if (tableCount >= 0) {
//         res.json({ 
//             success: true,  
//             count: tableCount
//         });
//     } else {
//         res.status(500).json({ 
//             success: false, 
//             count: tableCount
//         });
//     }
// });


// module.exports = router;


// ----------------------------------------------------------
const forbiddenwords = ["SELECT", "INSERT", "UPDATE", "DELETE", "DROP", "ALL", "OR", "AND", "--", "#", "/*", "*/", "*", "%"];

// 2.2.2 Sanitization
function Sanitization(req) {
    const ParsedString = JSON.stringify(req.body).toUpperCase();
    for (const word of forbiddenwords) {
        if (ParsedString.includes(word)){
            console.log(`SANITIZATION FAILED: ` + word);
            return false;
        }
    }
    return true;
}

// 2.1.1 INSERT
router.post("/insert", async (req, res) => {
    console.log("POST - INSERT");
    // 2.2.2 Sanitization
    if (!Sanitization(req)) {
        return res.status(400).json({ success: false, message: "USER INPUT INVALID - SANITIZATION FAILED" });
    }

    const { ListID, PartID } = req.body;
    const result = await appService.INSERT(ListID, PartID);
    if (result) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

// 2.1.2 UPDATE
router.post("/update", async (req, res) => {
    console.log("POST - UPDATE");
    // 2.2.2 Sanitization
    if (!Sanitization(req)) {
        return res.status(400).json({ success: false, message: "USER INPUT INVALID - SANITIZATION FAILED" });
    }
    const { PartID, Name, Model, Rating, ManufacturerID } = req.body;
    const result = await appService.UPDATE(PartID, Name, Model, Rating, ManufacturerID);
    if (result == -1) {
        res.json({ success: false, message: "Not a real manufacturer ID, please enter a valid one" });
    } else if (result) {
        res.json({ success: true, message: null });
    } else {
        res.status(500).json({ success: false , message: "Not a real product ID, please enter a valid one"});
    }
});

// 2.1.3 DELETE 
router.post('/delete', async (req, res) => {
    console.log("POST - DELETE");
    // 2.2.2 Sanitization
    if (!Sanitization(req)) {
        return res.status(400).json({ success: false, message: "USER INPUT INVALID - SANITIZATION FAILED" });
    }

    const { ListID, PartID } = req.body;
    const result = await appService.DELETE(ListID, PartID);
    if (result) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

// 2.1.4 Selection
router.get('/selection', async (req, res) => {
    console.log("POST - SELECTION");
    // 2.2.2 Sanitization
    if (!Sanitization(req)) {
        return res.status(400).json({ success: false, message: "USER INPUT INVALID - SANITIZATION FAILED" });
    }

    const {name, model} = req.body;
    const result = await appService.SELECTION(name, model);
    if (result) {
        res.json(result);
    } else {
        res.status(500).json({ success: false });
    }
});

// 2.1.5 Projection
router.post('/projection', async (req, res) => {
    console.log("POST - PROJECTION");
    // 2.2.2 Sanitization
    if (!Sanitization(req)) {
        return res.status(400).json({ success: false, message: "USER INPUT INVALID - SANITIZATION FAILED" });
    }

    const {attributes, tablename} = req.body;
    const result = await appService.PROJECTION(attributes, tablename);
    if (result) {
        res.json(result);
    } else {
        res.status(500).json({ success: false });
    }
});

// 2.1.6 Join
router.post('/join', async (req, res) => {
    console.log("POST - JOIN");
    // 2.2.2 Sanitization
    if (!Sanitization(req)) {
        return res.status(400).json({ success: false, message: "USER INPUT INVALID - SANITIZATION FAILED" });
    }

    const {Rating} = req.body;
    const result = await appService.JOIN(Rating);
    if (result) {
        res.json(result);
    } else {
        res.status(500).json({ success: false });
    }
});

// 2.1.7 Aggregation with GROUP BY
router.post('/group-by', async (req, res) => {
    console.log("POST - GROUPBY");
    // 2.2.2 Sanitization
    if (!Sanitization(req)) {
        return res.status(400).json({ success: false, message: "USER INPUT INVALID - SANITIZATION FAILED" });
    }

    const result = await appService.GROUPBY();
    if (result) {
        res.json(result);
    } else {
        res.status(500).json({ success: false });
    }
});

// 2.1.8 Aggregation with HAVING
router.post('/having', async (req, res) => {
    console.log("POST - HAVING");
    // 2.2.2 Sanitization
    if (!Sanitization(req)) {
        return res.status(400).json({ success: false, message: "USER INPUT INVALID - SANITIZATION FAILED" });
    }

    const {Rating} = req.body;
    const result = await appService.HAVING(Rating);
    if (result) {
        res.json(result);
    } else {
        res.status(500).json({ success: false });
    }
});

// 2.1.9 Nested aggregation with GROUP BY
router.post('/nested-group-by', async (req, res) => {
    console.log("POST - NESTEDGROUPBY");
    // 2.2.2 Sanitization
    if (!Sanitization(req)) {
        return res.status(400).json({ success: false, message: "USER INPUT INVALID - SANITIZATION FAILED" });
    }

    const result = await appService.NESTEDGROUPBY();
    if (result) {
        res.json(result);
    } else {
        res.status(500).json({ success: false });
    }
});

// 2.1.10 Division
router.post('/division', async (req, res) => {
    console.log("POST - DIVISION");
    // 2.2.2 Sanitization
    if (!Sanitization(req)) {
        return res.status(400).json({ success: false, message: "USER INPUT INVALID - SANITIZATION FAILED" });
    }

    const result = await appService.DIVISION();
    if (result) {
        res.json(result);
    } else {
        res.status(500).json({ success: false });
    }
});


// ----------------------------------------------------------
router.get('/SelectPCParts', async (req, res) => {
    console.log("GET - SelectPCParts");
    const tableContent = await appService.SelectPCParts();
    res.json({data: tableContent});
});

router.get('/SelectManufacturer', async (req, res) => {
    console.log("GET - SelectManufacturer");
    const tableContent = await appService.SelectManufacturer();
    res.json({data: tableContent});
});

router.get('/SelectRetailer', async (req, res) => {
    console.log("GET - SelectRetailer");
    const tableContent = await appService.SelectRetailer();
    res.json({data: tableContent});
});

router.get('/SelectPCPartsList', async (req, res) => {
    console.log("GET - SelectPCPartsList");
    const tableContent = await appService.SelectPCPartsList();
    res.json({data: tableContent});
});

router.get('/SelectBenchmarkTest', async (req, res) => {
    console.log("GET - SelectBenchmarkTest");
    const tableContent = await appService.SelectBenchmarkTest();
    res.json({data: tableContent});
});

router.post('/SelectPCPartsFromPCPartsList', async (req, res) => {
    console.log("POST - SelectPCPartsFromPCPartsList");
    // 2.2.2 Sanitization
    if (!Sanitization(req)) {
        return res.status(400).json({ success: false, message: "USER INPUT INVALID - SANITIZATION FAILED" });
    }

    const {ListID} = req.body;
    const result = await appService.SelectPCPartsFromPCPartsList(ListID);
    if (result) {
        res.json({success: true, data: result});
    } else {
        res.status(500).json({ success: false , message: "Not a real list ID, please enter a valid one"});
    }

    
});


// ----------------------------------------------------------
module.exports = router;