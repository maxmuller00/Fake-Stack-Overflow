const express = require('express');
const router = express.Router();

const Questions = require('../models/questions');
const Tags = require('../models/tags');
const Answers = require('../models/answers');
const Users = require('../models/users');
const Comments = require('../models/comments');

const auth = require('../middleware/auth');


async function searchByString(searchWords) {
  let results = [];
  for (let word of searchWords) {
    word = word.replace(/[\\.+*?^$[\](){}/'#:!=|]/gi, '\\$&'); // escape special characters
    try {
      const questions = await Question.find({$or: [{ title: { $regex: word, $options: 'i' } }, { text: { $regex: word, $options: 'i' } }],
      }).sort({ ask_date_time: -1 });
      results = [...results, ...questions];
    } catch (err) {
      console.error(err);
    }
  }
  return results;
}

async function searchByTag(searchTags) {
  try {
    // convert all tags to its ids
    const tagIds = [];
    for (const tag of searchTags) {
      console.log("SEARCH TAG ",tag);
      const tagObj = await Tag.findOne({ name: { $eq : tag } });
      console.log("TAGOBJ ", tagObj);
      if (tagObj) {
        tagIds.push(tagObj._id);
      }
    }
    const questions = await Question.find({ tags: { $in: tagIds } }).sort({ ask_date_time: -1 });
    console.log("QUESTIONS ",questions);
    return questions;
  } catch (err) {
    console.error(err);
  }
}

router.get('/', (req, res) => {
  console.log("TESTING ROUTER");
  res.redirect('/newest');
});

router.get('/searchingTag/:searchText', async (req, res) => {
  const phrase = req.params.searchText;
  console.log("PHRASE IS",phrase);
  if (phrase.trim() === '') {
    const questions = await Question.find().sort({ ask_date_time: -1 }).exec();
    res.send(questions);
    return;
  }
  let searchTags = [];
  searchTags.push(phrase);
  console.log("SEARCH TAGS", searchTags);

  const questionsByTag = await searchByTag(searchTags);
  console.log("QUESTIONS BY TAG", questionsByTag);

  let results = [questionsByTag];
  console.log("RESULTS ", results);

  const uniqueResults = [];

  for (const result of results) {
    if (!uniqueResults.find((r) => r._id.toString() === result._id.toString())) {
      uniqueResults.push(result);
    }
  }

  console.log("UNIQUE RESULTS ", uniqueResults);

  res.send(uniqueResults[0]);
});


router.get('/searching/:searchText', async (req, res) => {
  const phrase = req.params.searchText;
  console.log("PHRASE IS",phrase);
  if (phrase.trim() === '') {
    const questions = await Question.find().sort({ ask_date_time: -1 }).exec();
    res.send(questions);
    return;
  }
  console.log("TESTING SEARCH");
  let searchWords = [];
  let searchTags = [];
  let currentWord = '';
  for (let i = 0; i < phrase.length; i++) {
    if (phrase[i] === '[') {
      console.log("TEST 111")
      while (phrase[++i] !== ']' && phrase[i] !== ' ' && i < phrase.length) {
        currentWord += phrase[i];
      }
      console.log("115 CURRENT WORD",currentWord);
      if (phrase[i] === ']') {
        console.log("117 EOB");
        searchTags.push(currentWord.trim());
        for(const tag in searchTags){
          console.log(tag);
        }
        currentWord = '';
      } else {
        currentWord = '[' + currentWord;
        searchWords.push(currentWord.trim());
        currentWord = '';
      }
    } else {
      while (phrase[i] !== ' ' && i < phrase.length) {
        currentWord += phrase[i];
        i++;
      }
      searchWords.push(currentWord.trim());
      currentWord = '';
    }
  }
  const filteredSearchWords = searchWords.filter((word) => word !== '');

  const questionsByString = await searchByString(filteredSearchWords);
  const questionsByTag = await searchByTag(searchTags);

  let results = [...questionsByString, ...questionsByTag];

  const uniqueResults = [];

  for (const result of results) {
    if (!uniqueResults.find((r) => r._id.toString() === result._id.toString())) {
      uniqueResults.push(result);
    }
  }

  res.send(uniqueResults);
});


router.get('/newest', async (req, res) => {
  try {
    console.log("TESTING NEWEST");
    const result = await getNewestQuestions();
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

async function getNewestQuestions() {
  console.log("TESTING GETNEWEST");
  try {
    return await Question.find().sort({ ask_date_time: -1 }).exec();
  } catch (err) {
    throw err;
  }
}

async function getLatestAnswerDate(answerIds) {
  let latestDate = new Date(0);
  for (const answerId of answerIds) {
    console.log("ANSWERID ", answerId);
    const answer = await Answer.findById(answerId);
    console.log("ANSWER ", answer);
    if (new Date(answer.ans_date_time) > latestDate) {
      latestDate = answer.ans_date_time;
    }
  }
  return latestDate;
}

router.get('/active', async (req, res) => {
  try {
    /*const [questionsWithoutAnswers, questionsWithAnswers] = await Promise.all([
      Question.find({ answers: { $size: 0 } }).sort({ ask_date_time: -1 }),
      Question.find({ answers: { $exists: true, $ne: [] } }),
    ]);*/

    const questionsWithoutAnswers = await Question.find({ answers: { $size: 0 } }).sort({ ask_date_time: -1 });
    const questionsWithAnswers = await Question.find({ answers: { $exists: true, $ne: [] } })

    console.log("WITH ANSWERS ", questionsWithAnswers);
    console.log("WITHOUT ANSWERS ", questionsWithoutAnswers);

    const questionAnswerDateMap = new Map();

    await Promise.all(
      questionsWithAnswers.map(async (question) => {
        const latestAnswerDate = await getLatestAnswerDate(question.answers);
        questionAnswerDateMap.set(question, latestAnswerDate);
      })
    );

    questionsWithAnswers.sort((a, b) => {
      const aDate = questionAnswerDateMap.get(a);
      const bDate = questionAnswerDateMap.get(b);
      return bDate - aDate;
    });

    const questions = [...questionsWithAnswers, ...questionsWithoutAnswers];
    res.send(questions);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/unanswered', async (req, res) => {
  try {
    const result = await getUnansweredQuestions();
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

async function getUnansweredQuestions() {
  try {
    return await Question.find({ answers: { $size: 0 } }).sort({ ask_date_time: -1 }).exec();
  } catch (err) {
    throw err;
  }
}


  //gets question
  router.get('/:question', async (req, res) => {
    try {
      const question = await Question.findById(req.params.question).exec();
      if (question) {
        res.send(question);
      } else {
        //console.log("Here");
        res.status(404).send('Question not found');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });

  router.get('/getAllQuestions', async (req, res) => {
    try {
      const questions = await Question.find();
      res.send(questions);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  })

router.get('/comments/:question_id', async (req, res) => {
  try {
    const question = await Questions.findById(req.params.question_id).exec();
    const comment = await Comments.find({ _id: { $in: question.comments } }).sort({ com_date_time: -1 });
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

router.get('/:question', async (req, res) => {
  try {
    const question = await Questions.findById(req.params.question).exec();
    if (question) {
      res.send(question);
    } else {
      res.status(404).send('Question not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/byUser/:userId', async (req, res) => {
  try {
    // get all questions by userId then return it sorted by date
    const questions = await Questions.find({ asked_by: req.params.userId })
      .sort({
        ask_date_time: -1,
      })
      .exec();
    res.send(questions);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.patch('/incrementViews/:question', async (req, res) => {
  const question = await Questions.findById(req.params.question).exec();
  if (question) {
    question.views += 1;
    question.save();
    res.send(question);
  } else {
    res.status(404).send('Question not found');
  }
});

router.use(auth); // ANYTHING BELOW THIS WILL REQUIRE AUTHENTICATION

router.post('/askQuestion', async (req, res) => {
  let newQuestionInput = req.body;
  newQuestionInput.askedBy = req.session.user.userId; // do not trust the client to send the user id via post request
  const tagNames = Array.isArray(newQuestionInput.tagNames) ? newQuestionInput.tagNames : [];
  const tags = [...new Set(tagNames)];
  const tagIds = [];
  for (const tag of tags) {
    const tagExists = await Tags.findOne({ name: tag }).exec();
    if (tagExists) {
      tagIds.push(tagExists._id);
      Users.tags.push(tagExists._id);
    } else {
      try {
        const user = await Users.findOne({ _id: newQuestionInput.askedBy }).exec();
        if (user.reputation < 50) {
          res.send({ error: true, message: 'User must have atleast 50 reputation points to create a new tag.' });
          return;
        }
        const newTag = new Tags({ name: tag, created_By: newQuestionInput.askedBy });
        await newTag.save();
        tagIds.push(newTag._id);
      } catch (error) {
        console.error(error);
        res.status(500).send('Error creating tag');
        return;
      }
    }
  }

  try {
    const newQuestion = new Questions({
      title: newQuestionInput.title,
      summary: newQuestionInput.summary,
      text: newQuestionInput.text,
      tags: tagIds,
      asked_by: newQuestionInput.askedBy,
    });
    await newQuestion.save();
    Users.questions.push(newQuestion._id);
    res.send(newQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating question');
  }
});

router.put('/editQuestion/:question', async (req, res) => {
  const question = await Questions.findById(req.params.question).exec();
  if (question) {
    const editQuestion = req.body;
    question.title = editQuestion.title;
    question.summary = editQuestion.summary;
    question.text = editQuestion.text;
    const tagNames = Array.isArray(editQuestion.tagNames) ? editQuestion.tagNames : [];
    const tags = [...new Set(tagNames)];
    const tagIds = [];
    for (const tag of tags) {
      const tagExists = await Tags.findOne({ name: tag }).exec();
      if (tagExists) {
        tagIds.push(tagExists._id);
      } else {
        try {
          const user = await Users.findOne({ _id: question.asked_by }).exec();
          if (user.reputation < 50) {
            res.send({ error: true, message: 'User must have atleast 50 reputation points to create a new tag.' });
            return;
          }
          const newTag = new Tags({ name: tag, created_By: question.asked_by });
          await newTag.save();
          tagIds.push(newTag._id);
        } catch (error) {
          console.error(error);
          res.status(500).send('Error creating tag');
          return;
        }
      }
    }
    question.tags = tagIds;
    await question.save();
    res.send(question);
  } else {
    res.status(404).send('Question not found');
  }
});

router.delete('/deleteQuestion/:question', async (req, res) => {
  try {
    const question = await Questions.findById(req.params.question).exec();
    if (!question) {
      res.status(404).send('Question not found');
      return;
    }

    question.answers.forEach(async (answer) => {
      await Answers.findByIdAndDelete(answer).exec();
    });

    question.comments.forEach(async (comment) => {
      await Comments.findByIdAndDelete(comment).exec();
    });

    await Questions.findByIdAndDelete(req.params.question).exec();
    res.send('success');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.patch('/incrementVotes/:question/:userVoted', async (req, res) => {
  const question = await Questions.findById(req.params.question).exec();
  let updateUserReputation = 0;
  if (question) {
    let voterObj = question.voters.filter((voter) => voter.userVoted.toString() === req.params.userVoted);
    if (voterObj.length > 0) {
      let userVoted = voterObj[0].userVoted;
      let currentDirection = voterObj[0].direction;
      if (currentDirection === -1) {
        question.votes += 1;
        updateUserReputation = 10;
      } else if (currentDirection === 0) {
        question.votes += 1;
        updateUserReputation = 5;
      }
      let direction = Math.min(currentDirection + 1, 1);
      const objIndex = question.voters.findIndex((obj) => obj.userVoted == userVoted);
      question.voters[objIndex].direction = direction;
    } else {
      question.votes += 1;
      updateUserReputation = 5;
      question.voters.push({
        userVoted: req.params.userVoted,
        direction: 1,
      });
    }
    await question.save();
    let userToUpdate = await Users.findOne({ _id: question.asked_by }).exec();
    userToUpdate.reputation += updateUserReputation;
    await userToUpdate.save();
    res.status(200).send(question);
  } else {
    res.status(404).send('Question not found');
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

router.patch('/decrementVotes/:question/:userVoted', async (req, res) => {
  const question = await Questions.findById(req.params.question).exec();
  let updateUserReputation = 0;
  if (question) {
    let voterObj = question.voters.filter((voter) => voter.userVoted.toString() === req.params.userVoted);
    if (voterObj.length > 0) {
      let userVoted = voterObj[0].userVoted;
      let currentDirection = voterObj[0].direction;
      if (currentDirection === 1) {
        question.votes -= 1;
        updateUserReputation = 5;
      } else if (currentDirection === 0) {
        question.votes -= 1;
        updateUserReputation = 10;
      }
      let direction = Math.max(currentDirection - 1, -1);
      const objIndex = question.voters.findIndex((obj) => obj.userVoted == userVoted);
      question.voters[objIndex].direction = direction;
    } else {
      question.votes -= 1;
      updateUserReputation = 10;
      question.voters.push({
        userVoted: req.params.userVoted,
        direction: -1,
      });
    }
    await question.save();
    let userToUpdate = await Users.findOne({ _id: question.asked_by }).exec();
    userToUpdate.reputation -= updateUserReputation;
    await userToUpdate.save();
    res.status(200).send(question);
  } else {
    res.status(404).send('Question not found');
  }
});

  module.exports = router;

