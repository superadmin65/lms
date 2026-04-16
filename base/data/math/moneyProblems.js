const denominations = {
  title: "Notes and coins used in our country",
  values: [2000, 500, 200, 100, 50, 20, 10, 5, 2, 1]
};

const denominationsProblem = {
  title: `Make the following amounts using different combinations of notes/coins.`,
  text: `A chocolate box for Rs 865
    A water bottle for Rs 393
    A chair for Rs 942
    A watch for Rs 2346
    A mobile phone for Rs 6540
    A table for Rs 3255`,
};

const add = `Neha bought paint color for Rs 220 and paint brushes for Rs 150. How much money did she pay in total?
Rahul bought a shirt for Rs 230 and pants for Rs 525. How much did Rahul pay for his clothes?
Anu had Rs 215 and her friend had Rs 195. How much money does Anu and her friend have together?
After buying a movie ticket for Rs 150, Jia has Rs 75 left. How much total money did Jia have before buying ticket?
Reena sold a lamp for Rs 3426 and a table fan for Rs 1769. How much money did she get in total?`;

const sub = `Anna has Rs 250 with her. She bought a book for Rs 140. How much money will be left with her?
Ria had Rs 150, she bought apples for Rs 120. How much money is Ria left with?
Raj had Rs 500 with him. He spent Rs 105 on new slippers. How much money is left with Raj?
Hari had Rs 300 and he paid Rs 25. How much money is left with him?
Sohail has Rs 656 and his sister has Rs 434. How much more does Sohail have than his sister?
Gaurav has Rs 2453 and Umang has Rs 1222. How much more money does Gaurav have than Umang?`;

const multiply = `A pen cost Rs 10. Rahul bought 5 pens. How much money did he pay in total?
Seema bought 4 chocolates for Rs 5 each. How much did Seema spend on chocolates in total?
Rohan bought 4 boxes of sweet. Each box costs Rs 75. How much money did he pay to the shop keeper in total?
Ahmad bought 3 kurtas for Rs 450 each. How much did he pay in total?
Priya earned Rs 350 for an hour. How much would she earn in total if she worked for 7 hours?
One block costs Rs 56. How much will 6 blocks cost?
One crayon costs Rs 3. How much will 58 such crayons cost?
Mary worked to earn Rs 24 per hour. How much will she earn for 12 hours of work?
Each marble costs Rs 13. Mohan wants 40 marbles. How much should he pay the shopkeeper?
Irfan gets Rs 15 every day as pocket money. How much money does he get in a week?
Riya watches a movie every month. A ticket costs Rs 130. How much money does she spend on movies every year?`;


export default {
  denominations,
  denominationsProblem,
  wordProblems: {
    add,
    sub,
    multiply
  }
}