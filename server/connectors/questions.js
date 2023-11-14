const express = require('express');
const router = express.Router();

const Question = require('../models/questions');
const Tag = require('../models/tags');
const Answer = require('../models/answers');

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

//increments views of question
router.patch('/incrementViews/:question', async (req, res) => {
    const question = await Question.findById(req.params.question).exec();
    if (question) {
      question.views += 1;
      await question.save();
      res.send(question);
    } else {
      res.status(404).send('Question not found');
    }
  });


  //asks new question
  router.post('/askQuestion/', async (req, res) => {
    let newQuestionInput = req.body;
    const tagNames = Array.isArray(newQuestionInput.tags) ? newQuestionInput.tags : [];
    const tags = [...new Set(tagNames)];
    const tagIds = [];
    for (const tag of tags) {
      const tagExists = await Tag.findOne({ name: tag }).exec();
      if (tagExists) {
        tagIds.push(tagExists._id);
      } else {
        try {
          const newTag = new Tag({ name: tag });
          await newTag.save();
          tagIds.push(newTag._id);
        } catch (error) {
          console.error(error);
          res.status(500).send('Error creating tag');
          return;
        }
      }
    }
  
    const newQuestion = new Question({
      title: newQuestionInput.title,
      text: newQuestionInput.text,
      tags: tagIds,
      asked_by: newQuestionInput.asked_by,
    });
    await newQuestion.save();
    res.send(newQuestion);
  });

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

  module.exports = router;

