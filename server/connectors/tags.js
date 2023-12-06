const express = require('express');
const router = express.Router();

const Questions = require('../models/questions');
const Tags = require('../models/tags');
const Answers = require('../models/answers');

async function getTagByName(tagName){
    try{
        const tagObj = await Answers.findOne({name: tagName});
        return tagObj;
    } catch (err) {
        console.error(err);
    }
}

//gets all Tags
router.get('/', async (req, res) => {
  try {
    const tags = await Tags.find().exec();
    res.send(tags);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
})

//gets tag by Id
router.get('/:tag_Id', async (req, res) => {
  try {
    const tag = await Tags.findById(req.params.tag_Id).exec();
    res.send(tag);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
})

// Converts tag_name (string) into tag_id
router.get('/tagIdByName/:tag', async (req, res) => {
  const tag = req.params.tag;
  try {
    const result = await Tags.find({ name: tag }).exec();
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

//adds a new tag
router.post('/addNewTag', async (req, res) => {
  const newInput = req.body;
  try {
    const newTag = new Tags({
      name : newInput.name,
      numQ : 1,
    });
    await newTag.save();
    res.send(newTag);
  } catch (err) {
    console.error(err);
    res.status(500).send("Couldn't add Tag");
  }
});

//increments number of questions that belong to the tag
router.patch('/incrementNumQ/:tagName', async (req, res) => {
  const tag = await getTagByName(req.params.tagName);
  if (tag) {
    tag.numQ += 1;
    await tag.save();
    res.send(tag);
  } else {
    res.status(404).send("Tag not found");
  }
});

router.get('/questionsPerTag/:tag_id', async(req, res) => {
  const tag_id = req.params.tag_id;
  console.log("TAG_ID ",tag_id);
  try {
    const tags = await Questions.find({ tags : tag_id }).exec();
    res.send(tags);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
})
router.get('/getUser/:user_id', async (req, res) => {
  const user_id = req.params.user_id;
  try {
    const result = await Tags.find({ created_By: user_id }).exec();
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

const auth = require('../auth');

router.put('/modify/:tag_id', auth, async (req, res) => {
  const tag_id = req.params.tag_id;
  let tag_name = req.body.name;

  tag_name = tag_name.toLowerCase();
  if (tag_name.length > 10 || tag_name.length < 1) {
    res.send('Error tag cannot be more than 10 characters or less than 1 character');
    return;
  }

  try {
    const tagObj = await Tags.find({ _id: tag_id }).exec();
    // makes sure that it's the owner of the tag
    if (tagObj[0].created_By.toString() !== req.session.user.userId && !req.session.user.isAdmin) {
      res.send('Error you are not the owner of this tag');
      return;
    }

    // makes sure that no other user is using this tag
    const questionUsingTag = await Questions.find({ tags: tag_id }).exec();
    for (let i = 0; i < questionUsingTag.length; i++) {
      if (questionUsingTag[i].asked_by.toString() !== tagObj[0].created_By.toString()) {
        res.send('Error another user is using this tag');
        return;
      }
    }

    // updates the tag
    const result = await Tags.updateOne({ _id: tag_id }, { $set: { name: tag_name } }).exec();
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.delete('/delete/:tag_id', auth, async (req, res) => {
  const tag_id = req.params.tag_id;
  try {
    const tagObj = await Tags.find({ _id: tag_id }).exec();
    // makes sure that it's the owner of the tag
    if (tagObj[0].created_By.toString() !== req.session.user.userId && !req.session.user.isAdmin) {
      res.send('Error you are not the owner of this tag');
      return;
    }

    // makes sure that no other user is using this tag
    const questionUsingTag = await Questions.find({ tags: tag_id }).exec();
    for (let i = 0; i < questionUsingTag.length; i++) {
      if (questionUsingTag[i].asked_by.toString() !== tagObj[0].created_By.toString()) {
        res.send('Error another user is using this tag');
        return;
      }
    }

    // deletes the tag
    await Tags.deleteOne({ _id: tag_id }).exec();
    // deletes the tag from all questions
    await Questions.updateMany({}, { $pull: { tags: tag_id } }).exec();
    res.send({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

  module.exports = router;



