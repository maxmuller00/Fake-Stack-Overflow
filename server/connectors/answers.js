const express = require('express');
const router = express.Router();

const Questions = require('../models/questions');
const Answers = require('../models/answers');
const Users = require('../models/users');
const Comments = require('../models/comments');

const auth = require('./auth');


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
      const result = await Answers.findById(ans_id).exec();
      res.send(result);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });


  router.get('/getAnswered/:user_id', async (req, res) => {
    try {
      const answersByUser = await Answers.find({ ans_by: req.params.user_id }).exec();
      const questions = await Questions.find({ answers: { $in: answersByUser } }).sort({ ask_date_time: -1 });
      res.send(questions);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });

  router.get('/comments/:answer_id', async (req, res) => {
    try {
      const answer = await Answers.findById(req.params.answer_id).exec();
      const comment = await Comments.find({ _id: { $in: answer.comments } }).sort({ com_date_time: -1 });
      if (comment) {
        res.send(comment);
      } else {
        res.status(404).send('Answer not found');
      }
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
router.get('/getAnswered/:user_id', async (req, res) => {
  try {
    const answersByUser = await Answers.find({ ans_by: req.params.user_id }).exec();
    const questions = await Questions.find({ answers: { $in: answersByUser } }).sort({ ask_date_time: -1 });
    res.send(questions);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

  router.patch('/incrementVotes/:answer/:userVoted', async (req, res) => {
    console.log("TEST1");
    const answer = await Answers.findById(req.params.answer).exec();
    let updateUserReputation = 0;
    if (answer) {
      let voterObj = answer.voters.filter((voter) => voter.userVoted.toString() === req.params.userVoted);
      if (voterObj.length > 0) {
        let userVoted = voterObj[0].userVoted;
        let currentDirection = voterObj[0].amount;
        if (currentDirection === -1) {
          answer.votes += 1;
          updateUserReputation = 10;
        } else if (currentDirection === 0) {
          answer.votes += 1;
          updateUserReputation = 5;
        }
        let direction = Math.min(currentDirection + 1, 1);
        const objIndex = answer.voters.findIndex((obj) => obj.userVoted == userVoted);
        answer.voters[objIndex].direction = direction;
      } else {
        answer.votes += 1;
        updateUserReputation = 5;
        answer.voters.push({
          userVoted: req.params.userVoted,
          direction: 1,
        });
      }
      await answer.save();
      let userToUpdate = await Users.findOne({ _id: answer.ans_by }).exec();
      userToUpdate.reputation += updateUserReputation;
      await userToUpdate.save();
      res.status(200).send(answer);
    } else {
      res.status(404).send('Answer not found');
    }
  });

  router.patch('/decrementVotes/:answer/:userVoted', async (req, res) => {
    const answer = await Answers.findById(req.params.answer).exec();
    let updateUserReputation = 0;
    if (answer) {
      let voterObj = answer.voters.filter((voter) => voter.userVoted.toString() === req.params.userVoted);
      if (voterObj.length > 0) {
        let userVoted = voterObj[0].userVoted;
        let currentDirection = voterObj[0].amount;
        if (currentDirection === 1) {
          answer.votes -= 1;
          updateUserReputation = 5;
        } else if (currentDirection === 0) {
          answer.votes -= 1;
          updateUserReputation = 10;
        }
        let direction = Math.max(currentDirection - 1, -1);
        const objIndex = answer.voters.findIndex((obj) => obj.userVoted == userVoted);
        answer.voters[objIndex].direction = direction;
      } else {
        answer.votes -= 1;
        updateUserReputation = 10;
        answer.voters.push({
          userVoted: req.params.userVoted,
          direction: -1,
        });
      }
      await answer.save();
      let userToUpdate = await Users.findOne({ _id: answer.ans_by }).exec();
      userToUpdate.reputation -= updateUserReputation;
      await userToUpdate.save();
      res.status(200).send(answer);
    } else {
      res.status(404).send('Answer not found');
    }
  });

  
router.use(auth); // ANYTHING BELOW THIS WILL REQUIRE AUTHENTICATION

router.post('/answerQuestion', async (req, res) => {
    let newAnswerInput = req.body;
    try {
      console.log("TEST 1");
      const newAnswer = new Answers({
        text: newAnswerInput.text,
        ans_by: newAnswerInput.ans_by,
        ans_by_name: newAnswerInput.ans_by_name,
        question: newAnswerInput.qid,
      });
      console.log("TEST 3");
      await newAnswer.save();
      console.log("TEST 2");
      if (!newAnswerInput.qid) {
        res.status(400).send('Missing qid parameter');
        return;
      }
  
      const question = await Questions.findById(newAnswerInput.qid).exec();
  
      if (question) {
        question.answers.push(newAnswer._id);
        //Users.answers.push(newAnswer._id);
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

router.delete('/deleteAnswer/:answer_id', async (req, res) => {
  try {
    const answer = await Answers.findById(req.params.answer_id).exec();
    console.log("ANSWER IS ", answer);
    if (answer) {
      const question = await Questions.find({ answers: { $in: answer } }).exec();
      if (question) {
        question[0].answers.pull(answer._id);
        await question[0].save();
      }

      answer.comments.forEach(async (comment) => {
        await Comments.deleteOne({ _id: comment._id }).exec();
      });

      await Answers.deleteOne({ _id: req.params.answer_id }).exec();
      res.send('success');
    } else {
      res.status(404).send('Answer not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.put('/editAnswer/:answer_id', async (req, res) => {
  try {
    const answer = await Answers.findById(req.params.answer_id).exec();
    if (answer) {
      const result = await Answers.updateOne({ _id: req.params.answer_id }, { $set: { text: req.body.text } }).exec();
      res.send(result);
    } else {
      res.status(404).send('Answer not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});


router.patch('/comments/incrementVotes/:comment/:userVoted', async (req, res) => {
  const comment = await Comments.findById(req.params.comment).exec();
  let updateUserReputation = 0;
  if (comment) {
    let voterObj = comment.voters.filter((voter) => voter.userVoted.toString() === req.params.userVoted);
    if (voterObj.length === 0) {
      comment.votes += 1;
      updateUserReputation = 5;
      comment.voters.push({
        userVoted: req.params.userVoted,
      });
    }
    await comment.save();
    let userToUpdate = await Users.findOne({ _id: comment.com_by }).exec();
    userToUpdate.reputation += updateUserReputation;
    await userToUpdate.save();
    res.status(200).send(comment);
  } else {
    res.status(404).send('Question not found');
  }
});

module.exports = router;
