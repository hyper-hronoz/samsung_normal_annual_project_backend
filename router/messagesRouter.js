const router = require("express").Router()

router.get("/", (req, res)=> {
    res.send("Hello");
})

router.post("/", (req, res) => {

})

router.put("/", (req, res) => {

})

router.delete("/", (req, res) => {

})

module.exports = router