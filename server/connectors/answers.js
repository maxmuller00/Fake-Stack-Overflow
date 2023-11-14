const express = require('express');
const router = express.Router();

const Questions = require('../models/questions');
const Tags = require('../models/tags');
const Answers = require('../models/answers');

async function getAnswerById(id){
    try{
        const answerObj = await Answers.findOne({aid: id});
        return answerObj;
    } catch (err) {
        console.error(err);
    }
}

router.get('/', async (req, res) => {
  try {
    const answers = await Answers.find().exec();
    console.log(answers);
    res.send(answers);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'})
  }
});

router.get('/:ans_id', async (req, res) => {
    const ans_id = req.params.ans_id;
    try {
      const result = await getAnswerById(ans_id);
      res.send(result);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });

  router.get('/getAnswersForQuestion/:qid', async (req, res) => {
    try {
      const question = await Questions.findById(req.params.qid).exec();
      const answer = await Answers.find({_id: {$in: question.answers}}).sort({ans_date_time : -1});
      if (answer) {
        res.send(answer);
      } else {
        res.status(404).send('Answer not found');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });

  router.post('/answerQuestion', async (req, res) => {
    let newAnswerInput = req.body;
    try {
      const newAnswer = new Answers({
        text: newAnswerInput.text,
        ans_by: newAnswerInput.ans_by,
      });
      await newAnswer.save();
  
      if (!newAnswerInput.qid) {
        res.status(400).send('Missing qid parameter');
        return;
      }
  
      const question = await Questions.findById(newAnswerInput.qid).exec();
  
      if (question) {
        question.answers.push(newAnswer._id);
        await question.save();
        res.send(question);
      } else {
        res.status(404).send('Question not found');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });

module.exports = router;
