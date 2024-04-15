const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user.model');
const Exercise = require('../models/exercise.model');

router.post('/', async (req, res) => {
    const body = req.body;
    console.log(body);
    await bcrypt.genSalt(10, (err, salt) => {
        if(err){
            console.error(err);
        }
        bcrypt.hash(body.password, salt, (err, hash) => {
            if(err){
                console.error(err);
            }
            body.password = hash;
        })
    })
    const user = new User(body);
    await user.save()
    .then(docs => {
        console.log(docs)
        res.json({username: user.username, _id: user._id});
    })
    .catch(err => {
        console.error(err);
        res.json({error: "COULD NOT SAVE DOCUMENTS"})
    })
});

router.get('/', async (req, res) => {
    await User.find({}, 'username _id')
    .then(docs => {
        res.send(docs);
    })
    .catch(err => {
        console.error(err);
    })
});

router.post('/login', async (req, res) => {
    const body = this.body;
    await User.findOne(body.username, 'username password')
    .then(docs => {
        bcrypt.compare(body.password, docs.password, (err, res) => {
            if(err){
                console.error(err);
                res.json({error: 'invalid password'})
            }
            if(!res) {
                res.json({error: 'invalid password', auth: false})
            }
        })
        res.json({auth: true, username: docs.username});
    })
    .catch(err => {
        res.json({error: 'invalid username', auth: false})
    })
})

router.get('/login', (req, res) => {
    res.send("Login view to be created");
})

router.post('/:_id/exercises', async (req, res) => {
    if(req.body.date === ""){
        req.body.date = new Date().toString();
    }
    const body = req.body;
    console.log(`body before ${body}`);
    await User.findById(req.params._id)
    .then(docs => {
        req.body.user = req.params._id;
        const exercise = new Exercise(body);
        exercise.save()
        .then(docs2 => {
            console.log(`successfully saved exercise: ${docs2}`);
            docs.log.push(docs2._id);
            docs.save()
            .then(() => {
                console.log(`successfully updated user logs: ${docs.log}`);
                res.json({username: docs.username, description: docs2.description, duration: docs2.duration, date: docs2.date, _id: docs._id});
            })
            .catch(err => {
                console.error(err);
                Exercise.findOneAndDelete({_id: docs2._id});
                res.json({error: "ERROR WHILE UPDATING USER LOGS"});
            })
        })
        .catch(err => {
            console.error(err);
            res.json({error: "ERROR WHILE SAVING DOCUMENTS"});
        })
    })
    .catch(err => {
        console.error(err);
        res.json({error: "COULD NOT FIND USER ID IN DATABASE"});
    })
});

router.get('/:_id', async (req, res) => {
    //res.send("Success!")

    await User.findOne({ _id: req.params._id }, 'username _id')
    .then(docs => {
        res.json(docs);
    })
    .catch(err => {
        console.error(err);
    })
})

router.get('/:_id/exercises', async (req, res) => {
    await User.findOne({ _id: req.params._id }, 'log')
    .then(docs => {
        res.json(docs);
    })
    .catch(err => {
        console.error(err)
    })
})

router.get('/:_id/logs', async (req, res) => {
    await User.findById({ _id: req.params._id }, 'username _id log')
    .then(docs => {
        //const list = docs.log;
        //const count = list.length;
        Exercise.find({user: docs._id}, 'description duration date')
        .then(docs2 => {
            const count = docs2.length;
            const logs = docs2.map(item => {
                return {description: item.description, duration: item.duration, date: item.date}
            });
            console.log(docs2);
            res.json({username: docs.username, count: count, _id: docs._id, log: logs});
        })
        .catch(err => {
            console.error(err);
        })
    })
    .catch(err => {
        console.error(err);
    })
})

/*router.get('/:_id/logs/:limit?&:from?:&:to?', async (req, res) => {
    await User.findById({ _id: req.params._id }, 'username _id log')
    .then(docs => {
        Exercise.find({user: docs._id}, 'description duration date')
        .then(docs2 => {
            const count = docs2.length;
            const logs = docs2.map(item => {
                return {description: item.description, duration: item.duration, date: item.date}
            });
            console.log(docs2);
            res.json({username: docs.username, count: count, _id: docs._id, log: logs});
        })
        .catch(err => {
            console.error(err);
        })
    })
    .catch(err => {
        console.error(err);
    })
})*/

router.get('/:_id/exercise/:_id2', async (req, res) => {
    await Exercise.findById({ _id: req.params._id2 }, 'log'
    .then(docs => {
        if(docs.user == req.params._id){
            res.json(docs);
        }
        else {
            res.json({ERROR: "USER NOT PERMITTED TO SEE DATA FROM OTHER USERS"})
        }
    }))
    .catch(err => {
        console.error(err);
        res.json({error: "ERROR WHILE FETCHING DOCUMENTS"})
    })
});

module.exports = router;