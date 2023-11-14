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

  module.exports = router;



