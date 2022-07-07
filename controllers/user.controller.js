const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.getAllUsers = async(req, res) => {
    const users = await UserModel.find().select('-password');
    res.status(200).json(users);
}

module.exports.userDetails = (req, res) => {
    if(!ObjectID.isValid(req.params.id))
        return res.status(400).send('Erreur: identifiant inconnu' + req.params.id)
    UserModel.findById(req.params.id, (err, docs) => {
        if(!err) res.send(docs)
        else console.log('Erreur: Identifiant inconnu' + err)
    }).select('-password');
} 

module.exports.updateUser = async (req, res) => {
    if(!ObjectID.isValid(req.params.id))
        return res.status(400).send('Erreur: identifiant inconnu' + req.params.id)
    try {
        await UserModel.findOneAndUpdate(
            {_id: req.params.id},
            {
                $set: {
                    bio: req.body.bio
                }
            },
            {new:true, upsert: true, setDefaultsOnInsert:true},
            (err, docs) => {
                if (!err) return res.send(docs);
                if (err) return res.status(500).send({message:err});
            }
        )
    } catch (err) {
        return res.status(500).json({message:err});
    }
}

module.exports.deleteUser = async(req, res) => {
    if(!ObjectID.isValid(req.params.id))
        return res.status(400).send('Erreur: identifiant inconnu' + req.params.id)
    try {
        await UserModel.remove({_id: req.params.id}).exec();
        res.status(200).json('utilisateur supprimé avec succès')
    } catch (err) {
        return res.status(500).json({message:err});
    }
}

module.exports.follow = async(req, res) => {
    if(!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToFollow))
        return res.status(400).send('Erreur: identifiant inconnu' + req.params.id)
    try {
        // Ajout de followers à la liste
        await UserModel.findByIdAndUpdate(
            req.params.id,
            {$addToSet: {following: req.body.idToFollow}},
            {new: true, upsert:true},
            (err, docs) => {
                if(!err) res.status(201).send(docs)
                else return res.status(400).send(err)
            }
        );

        // Ajout à la liste de following
        await UserModel.findByIdAndUpdate (
            req.body.idToFollow,
            {$addToSet: {followers: req.params.id}},
            {new: true, upsert:true},
            (err, docs) => {
                if(err) return res.status(400).send(err)
            }
        );

    } catch (err) {
        return res.status(500).json({message:err});
    }
}

module.exports.unfollow = async(req, res) => {
    if(!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToUnfollow))
        return res.status(400).send('Erreur: identifiant inconnu' + req.params.id)
        try {
            // Retrait du followers à la liste
            await UserModel.findByIdAndUpdate(
                req.params.id,
                {$pull: {following: req.body.idToUnfollow}},
                {new: true, upsert:true},
                (err, docs) => {
                    if(!err) res.status(201).send(docs)
                    else return res.status(400).send(err)
                }
            );
    
            // Retrait à la liste du following
            await UserModel.findByIdAndUpdate (
                req.body.idToUnfollow,
                {$pull: {followers: req.params.id}},
                {new: true, upsert:true},
                (err, docs) => {
                    if(err) return res.status(400).send(err)
                }
            );
    
        } catch (err) {
            return res.status(500).json({message:err});
        }
}