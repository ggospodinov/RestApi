const express = require('express');
const router = express.Router();
const { authController } = require('../controllers');
const { auth } = require('../utils');
const cloudinary = require('../utils/cloudinary');
const upload = require('../utils/multer');
const User = require('../models/index')



router.get('/profile', auth(),authController.getProfileInfo);
router.put('/profile', auth(),authController.editProfileInfo);

router.post('/', upload.single('image'), async(req,res) =>{
    try {
      const result = await cloudinary.uploader.upload(req.file.path)
      let user = new User({
          username: req.body.username,
          avatar: result.secure_url,
          cloudinary_id: result.public_id
      });

      await user.save();
      res.json(user);

        
    } catch (err) {
        console.log(err)
    }
});

router.get('/', async (req, res)=>{
    try {
        let user = await  User.find();
        res.json(user);
    } catch (err) {
        console.log(err);
    }
})




module.exports = router