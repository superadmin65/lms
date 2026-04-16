const actionWord = `Subbu is *watching* TV.
The cat is *hiding* under the table.
The dog is *barking.*
The cat is *chasing* the mouse.
Tom is *bathing.*
My father is *washing* clothes.
My mother is *watering* the plants.
My sister is *sleeping.*
I am *reading* a book.
I am *studying.*
They are *eating* lunch.
My aunt is *cooking.*
My friends are *playing.*
My uncle is *driving* the car.`;

const properNoun = `*Siva* is a farmer.
I am living in *Chennai.*
*Delhi* is very hot in summer.
*Devi* is studying.
We order food from *Swiggy.*
My mummy is doing online shopping in *Amazon.*
I know how to cook *Maggi.*
*Newton* was a great scientist.
We went to *Ooty* for vacation.
*Microsoft* is a famous software company.`;

const commonNoun = `She is watching *TV.*
He is my *brother.*
His *father* is cooking.
They are playing in *garden.*
The *car* is moving fast.
We saw *birds* flying.
He is eating *ice-cream.*
I like to play *football.*
We have no *homework* today.
She goes to *market.*`;

export default {
  actionWord: {
    text: actionWord,
    title: 'Select the action word in the below sentence.'
  },
  properNoun: {
    text: properNoun,
    title: 'Select the proper noun in the below sentence.'
  },
  commonNoun: {
    text: commonNoun,
    title: 'Select the common noun in the below sentence.'
  }
};
