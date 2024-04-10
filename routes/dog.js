const express = require('express');
const router = express.Router();
const Dog = require('../models/dog')

//Example of protected route with User role

router.get('/', async (req,res) => {
    let dogs = await Dog.find();
    res.status(200).json(dogs)
})

router.post('/', async (req, res) => {
    const {name, breed, owner, isMicrochipped, image} = req.body
    try {
        let dogAlreadyExists = await Dog.findOne({name: name, owner: owner})
        if(dogAlreadyExists) {
            throw new Error("Dog already exists")
        } else {
            let newDog = await Dog.create({name, breed, owner, isMicrochipped, image})
            res.status(201).json(newDog)
        }

    } catch(err) {
        console.log("err", err)
        res.status(409).json({message: err.message})
    }
})

router.put('/:id', async (req, res, next) => {
    const {name, breed, owner, isMicrochipped, image} = req.body

    try {
        //{new: true} returns updated object 
        //{upsert: true} creates object if it doesn't already exist
        let dogToEdit = await Dog.findOneAndUpdate({_id: req.params.id}, {name, breed, owner, isMicrochipped, image}, {new: true})
        if(dogToEdit) {
            res.status(200).json({message: "Edit Successful"})
        } else {
            res.status(404).json({message: "Dog not found"})
        }
    } catch(err) {
        res.status(500).json({message: "Edit Failed", error:err.message})
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        let dog = await Dog.findById(req.params.id)
        if(dog) {
            await dog.deleteOne();
            res.status(200).json({message: "Dog deleted successfully"})
        } else {
            throw new Error("Dog not found")
        }
    } catch(err) {
        res.status(409).json({message: err.message})
    }
})

module.exports = router