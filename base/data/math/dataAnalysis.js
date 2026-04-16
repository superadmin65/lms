const tallyChart = [
  {
    inst: "Use the tally chart and answer each question given below.",
    labels: ["Days", "Snakes Rescued"],
    values: {
      Monday: 15,
      Tuesday: 24,
      Wednesday: 12,
      Thursday: 19,
      Friday: 6,
      Saturday: 30,
      Sunday: 23
    },
    questions: `On which day were most snakes rescued?
      On which day were 24 snakes rescued?
      On how many days were more than 20 snakes rescued?
      On how many days were less than 15 snakes rescued?
      On which day were the fewest snakes rescued?
      Between Tuesday, Saturday and Sunday, on which day were the least snakes rescued?`
  },
  {
    inst:
      "Seema runs a canteen and sells sandwich, upma, idli and dosa. The tally chart below shows how many of each she sold on the weekend.",
    labels: ["Food items", "Tally marks"],
    values: {
      Sandwich: 16,
      Upma: 24,
      Idli: 12,
      Dosa: 8
    },
    questions: `How many plates of sandwich were sold?
      Which dish was sold the most?
      How many more plates of sandwich were sold than idlis?
      Which dish was sold the least?
      How many dishes were sold in all?`
  }
];

const pictograph = [
  {
    inst: "Read the following pictograph and answer the questions given below.",
    labels: ["Scoopy's Ice Cream Parlor"],
    values: {
      Monday: 9,
      Tuesday: 7,
      Wednesday: 10,
      Thursday: 6
    },
    scaleInfo: `1 ~img~ = 100 icecreams`,
    img: {
      url: "icecream.png"
    },
    questions: `How many ice creams were sold on Monday?
          How many icecreams where sold on Wednesday?
          How many total icecreams were sold on Tuesday and Wednesday?
          What is the difference between icecream sold on Thursday and Wednesday?
          On which day did Scoopy sell the highest number of ice creams?` 
  },
  {
    inst:
      "Read the following pictograph and answer the questions given below. A cinema showed the film 'Sky Rise' for 4 weeks. Read the number of visitors who went to see the film and answer the questions.",
    labels: ["Sky Rise Movie"],
    values: {
      "Week 1": 8,
      "Week 2": 10,
      "Week 3": 7,
      "Week 4": 6
    },
    scaleInfo: "Each ~img~ stands for 100 visitors",
    img: {
      url: "man.png"
    },
    questions: `How many visitors saw the movie in week 1?
          How many visitors saw the movie in week 2?
          What is the most number of tickets sold in a week?
          During which week did 'Sky Rise' movie sell the least number of tickets?
          What the the difference between the visitors during week 3 and week 4?`
  }
];

const barChart = [
  {
    inst: "Read the following bar graph and answer the given questions  below",
    labels: ["Number of animals", "Animals"],
    values: {
      Deer: 8,
      Tiger: 6,
      Monkey: 9,
      Lion: 6,
      Elephant: 4,
      Giraffe: 3
    },
    questions: `Write a number of top of each bar to display the number of animals of each kind.
          Are there more monkeys or deer?
          Which animals are double the count of giraffe?
          How many more elephants are required so that number of elephants and lions are equal?`
  },
  {
    inst:
      "Read the following bar graph and answer the given questions  below - Car Sales",
    labels: ["Number of Cars", "Types of Car"],
    values: {
      Sedan: 9,
      SUV: 6,
      Vanity: 8,
      "Sports Car": 5,
      "Micro car": 7,
      Carrier: 2
    },
    questions: `Which type of car was sold the most?
          How many fewer sports cars were solid than micro cars?
          How many more sedan cars were sold than SUVs?
          The sales of sports cars and carriers put together, equals 
          Find the total number of cars sold.`
  }
];

export default {
  pictograph,
  tallyChart,
  barChart
}